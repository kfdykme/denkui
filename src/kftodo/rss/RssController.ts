import { xml2js } from "https://deno.land/x/xml2js@1.0.0/mod.ts";

import { AsyncIpcData } from "@/ipc/AsyncIpcController.ts";
import Fetch from "@/system.fetch.ts";
import storage from "@/system.storage.ts";

import { HeaderInfo } from "@/kftodo/ReadBlog.ts";
// 纯工具

const getFirstObjectByName = (targetObj: any, name: string): any => {
    let res = null;
    for (let x in targetObj) {
        if (x === name) {
            return targetObj[x];
        }
        const v = targetObj[x];
        if (typeof v === "object") {
            for (let y in v) {
                res = getFirstObjectByName(v, name);
                if (res != null) {
                    break;
                }
            }
        }
    }

    return res;
};

const getStrFromXMLJson = (value: any): string => {
    if (value === undefined) {
        return "";
    }
    try {
        return value["_text"];
    } catch (err) {
        return err + "";
    }
};

interface IRSSItem {
    title: string;
    link: string;
    description: string;
    author: string;
    pubDate: string;
    category?: string;
}

interface IRSSChannel {
    title: string;
    link: string;
    description: string;
    copyright?: string;
    managingEditor?: string;
    item?: IRSSItem[];
}

interface IRSS {
    version: string;
    channel: IRSSChannel;
}

export class RssController {
    responseFunc: Function | undefined;

    constructor() { }

    initResponseFunc(func: Function) {
        this.responseFunc = func;
    }

    response(ipcData: AsyncIpcData) {
        if (this.responseFunc) {
            this.responseFunc(ipcData);
        } else {
            console.error('this.responseFunc is null')
        }
    }

    convertJSON2RssObject(rss: any): IRSS | undefined {
        if (typeof rss !== "object") {
            return undefined;
        }
        // 1 try get rss tag
        // console.info(rss)
        const version = rss["_attributes"].version;
        // for (let x );
        const channel: IRSSChannel = {
            title: getStrFromXMLJson(rss.channel.title),
            link: getStrFromXMLJson(rss.channel.link),
            description: getStrFromXMLJson(rss.channel.description),
            copyright: getStrFromXMLJson(rss.channel.copyright),
            managingEditor: getStrFromXMLJson(rss.channel.managingEditor),
            item: [],
        };

        // console.info(rss.channel && rss.channel.item && rss.channel?.item instanceof Array)
        if (rss.channel && rss.channel.item && rss.channel?.item instanceof Array) {
            for (let index in rss.channel.item) {
                const i: any = {};
                for (let x in rss.channel.item[index]) {
                    i[x] = getStrFromXMLJson(rss.channel.item[index][x]);
                }
                channel.item?.push(i);
            }
        }

        const res: IRSS = {
            version,
            channel,
        };
        return res;
    }

    async tryHandleInvoke(ipcData: AsyncIpcData): Promise<boolean> {
        console.info('tryHandleInvoke')
        console.info(ipcData)
        const { invokeName, data: invokeData } = ipcData.data;

        if (invokeName === "addRss") {
            const { url } = invokeData;
            console.info('tryhandleInvoke addRss', invokeData, url)
            const listDataRes = await storage.get({ key: "listData" });
            let isResed = false;
            // fetch url
            new Promise((resolve, reject) => {
                Fetch.do({
                    url,
                    method: "GET",
                    success: (res: any) => {
                        // handle xml
                        const obj = xml2js(res.data, {
                            compact: true,
                        });
                        resolve(obj);
                    },
                });
            })
                .then((res) => {
                    const rssObj = getFirstObjectByName(res, "rss");
                    return rssObj;
                })
                .then((rss) => {
                    const res = this.convertJSON2RssObject(rss);
                    if (res == undefined) {
                        throw Error("convert rss object fail");
                    }
                    return res;
                })
                .then(async (rss: IRSS) => {

                    const header: HeaderInfo = {
                        title: rss.channel?.title,
                        date: rss.channel?.managingEditor || rss.channel.link,
                        tags: [rss.channel?.title, '_RSS'],
                        path: url,
                        type: "rss",
                    };

                    const hitItems = listDataRes.data.headerInfos.filter((item: any) => {
                        return item.path == url
                    })

                    console.info('hitItems', hitItems.length)
                    if (hitItems.length > 0) {
                        ipcData.msg = `alread has this rss, try update news`;
                    } else {
                        listDataRes.data.headerInfos && listDataRes.data.headerInfos.push(header)
                    }

                    let hasNew = false;
                    rss.channel?.item?.forEach((item: IRSSItem) => {
                        listDataRes.data.headerInfos
                        const hitItems = listDataRes.data.headerInfos.filter((headerItem: any) => {
                            return headerItem.path == item.link
                        })
                        let rssItemHeader: any = {}
                        if (hitItems.length === 0) {
                            rssItemHeader = {
                                title: item.title,
                                date: item.pubDate,
                                tags: [rss.channel?.title, item.category ? item.category : ''].filter(i => i !== ''),
                                path: item.link,
                                type: "rssItem",
                            };
                            listDataRes.data.headerInfos && listDataRes.data.headerInfos.push(rssItemHeader as HeaderInfo)
                            hasNew = true
                        }
                    });
                    
                    if (!isResed) {

                        ipcData.data = listDataRes.data
                        await storage.set({ key: 'listData', value: ipcData.data });
                        if (hasNew) {
                            ipcData.msg = `${url} rss update success`;
                        } else {
                            ipcData.msg = `${url} without new item`;
                        }
                        this.response(ipcData)
                        isResed = true;
                    }
                })
                .catch((err) => {
                    if (!isResed) {
                        ipcData.msg = `error: ${err}`;
                        this.response(ipcData);
                    }
                    console.error('err' + err)
                })
                .finally(() => {
                    if (!isResed) {
                        this.response(ipcData);
                    }
                });

            return true;
        }

        return false;
    }
}
