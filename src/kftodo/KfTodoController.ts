import IpcController from "@/ipc/IpcController.ts"
import storage from '@/system.storage.ts'
import logger from '@/log/console.ts'
import fs from '@/common/common.fs.ts'
import { AsyncIpcController } from "@/ipc/AsyncIpcController.ts"
import { AsyncIpcData } from "@/ipc/AsyncIpcController.ts"
import ReadBlog, { HeaderInfo } from "@/kftodo/ReadBlog.ts"
import Path from '@/common/common.path.ts'
import {BlogTextHelper} from '@/kftodo/blog/BlogTextHelper.ts'
import toast from '@/system.toast.ts'

import ConfigManager from '@/kftodo/ConfigManager.ts'
import { RssController } from "@/kftodo/rss/RssController.ts"


interface IEventData {
    name: string
    data: any
}

interface IKfToDoConfig {
    basePath: string
}

export default class KfTodoController {

    ipc: AsyncIpcController | null = null

    hasFirstConnect = false

    static KFTODO_CONFIG_MD_PATH = Path.homePath() + Path.Dir.Spelator + '.denkui' + Path.Dir.Spelator + '.config.md'


    rssController: RssController = new RssController()

    config:IKfToDoConfig = {
        basePath: '.'
    }



    async start() {
        let res = (await storage.get({
            key: 'GLOBAL_PORT'
        }) as any)
        let iport = 8082
        try {
            iport = Number.parseInt(res.data)
        } catch (err) {
            logger.error('KfTodoController', err)
        }
        logger.info('KfTodoController port ', res.data, iport)
        this.ipc = new AsyncIpcController(iport || 8082)

        const onMessageHandler = (message: string) => {
            this.onMessage(message)
        }

        const onFirstConnect = (message: string) => {
            this.hasFirstConnect = false
        }

        this.ipc.addOnConnectCallback(onFirstConnect)
        this.ipc.addCallback(onMessageHandler)
        setInterval(() => {
            this.heart()
        }, 2000)

        toast.init(this.send)
        this.rssController.initResponseFunc((data: AsyncIpcData) => {
            data.isResponse = true;

            this.send(data)
        })
    }

    heart() {
        !this.hasFirstConnect && this.ipc?.send(JSON.stringify({
            name: 'heart',
            data: 'KfTodoController ' + !this.hasFirstConnect
        }))
    }

    send(event: any) {
        this.ipc?.send(JSON.stringify(event))
    }

    async initData() {
        logger.info('KfTodoController', 'initData')
        const listDataRes = await storage.get({ key: 'listData' })
        const confgPath = KfTodoController.KFTODO_CONFIG_MD_PATH
        if (!listDataRes.data) {
            const configTitle = 'KfTodoConfig'
            const configTags =  ['_KfTodoConfig']
            let item: HeaderInfo = {
                "title": configTitle,
                "date": new Date().toDateString(),
                "dateMs" : new Date().getTime(),
                "path": confgPath,
                "tags":configTags
            }
            if (!fs.statSync(confgPath).isExist) {
                const content = BlogTextHelper.GenerateEmptyText(configTitle, configTags, JSON.stringify({
                    basePath: '.'
                }, null, 2));
    
                fs.mkdirSync(Path.getDirPath(confgPath), { recursive: true})
                fs.writeFileSync(confgPath, content);
            } else {
                const currentConfigContent = fs.readFileSync(confgPath)
                try {
                    this.config = JSON.parse(BlogTextHelper.GetContentFromText(currentConfigContent))
                } catch (err) {
                    this.send({
                        name: 'system.toast',
                        data: {
                            error: `${err}`
                        }
                    })
                }
                
                item = ReadBlog.handleFile(currentConfigContent, confgPath)
            }
            listDataRes.data = {
                headerInfos: [item]
            }
            await storage.set({ key: 'listData', value: listDataRes.data})
        } else {
            
            const currentConfigContent = fs.readFileSync(confgPath)
            try {
                this.config = JSON.parse(BlogTextHelper.GetContentFromText(currentConfigContent))
            } catch (err) {
                this.send({
                    name: 'toast',
                    data: {
                        error: `${err}`
                    }
                })
            }
        }

        this.send({
            name: 'initData',
            data: listDataRes.data
        })

        const lastReadPathRes =  await storage.get({ key: 'lastReadPath' })
        if (lastReadPathRes.data) {
            this.send({
                name: 'notifyRead',
                data: lastReadPathRes.data
            })
        }
    }   

    async handleInvoke(ipcData: AsyncIpcData) {
        const { invokeName, data:invokeData } = ipcData.data

        logger.info('handleInvoke invokeName:', invokeName)
        if (invokeName === 'readFile') {
            const path = invokeData
            const content = fs.readFileSync(path)
            ipcData.data = {
                content,
                path: invokeData
            }
            this.ipc?.response(ipcData)
            await storage.set({ key: 'lastReadPath', value: path})
        }

        if (invokeName === 'getConfig') {
            ipcData.data = this.config
            this.ipc?.response(ipcData)
        }

        
        if (invokeName === 'writeFile') {
            const { content, path} = invokeData
            fs.mkdirSync(Path.getDirPath(path), { recursive: true})
            fs.writeFileSync(path, content);

            logger.info('handleInvoke writeFile path:', path)
            if (path.endsWith(ConfigManager.getFileExtByType('script', this.config))) {
                ipcData.msg = `${ipcData.data.invokeName} success`
                this.ipc?.response(ipcData)
            } else {
                const listDataRes = await storage.get({ key: 'listData' })
                const hitItems = listDataRes.data.headerInfos.filter((item :any) => {
                    return item.path == path
                })
                let item: any = {}
                if (hitItems.length === 0) {
                    item = {
                        "title": content.substring(0, 20),
                        "date": new Date().toDateString(),
                        "dateMs" : new Date().getTime(),
                        "path": path,
                        "tags": []
                    }
                    listDataRes.data.headerInfos &&  listDataRes.data.headerInfos.push(item)
                } else {
                    item = hitItems[0]
                }
    
                logger.info('handleInvoke writeFile path compare to', KfTodoController.KFTODO_CONFIG_MD_PATH)
                if (path === KfTodoController.KFTODO_CONFIG_MD_PATH || path === "./.denkui/.config.md") {
                    try { 
                        const configContent = BlogTextHelper.GetContentFromText(content).trim()
                        logger.info('KfTodoController ', configContent)
                        this.config = JSON.parse(configContent) 
                        // if (!isExist) {
                        //     ipcData.msg = `${ipcData.data.invokeName} file: ${this.config.basePath} n`
                        //     this.ipc?.response(ipcData)
                        //     return
                        // }
                        const files = fs.walkDirSync(this.config.basePath)

                        const denkuiblogFiles = files.filter((value) => {
                            const ext = ConfigManager.getFileExtByType('denkuiblog', this.config)
                            return value.name.endsWith(ext)
                        })

                        const infos = denkuiblogFiles.map(i => {
                            logger.info('KfTodoController ', i)
                            return ReadBlog.handleFile(fs.readFileSync(i.path), i.path)
                        }).filter(i => {
                            return i.title
                        })
                        const scriptFiles = files.filter((value) => {
                            return value.name.endsWith(ConfigManager.getFileExtByType('script', this.config))
                        })
                        logger.info('KfTodoController scriptFiles', scriptFiles)
            
                        scriptFiles.forEach((scriptFile) => {
                            infos.push({
                                path: scriptFile.path,
                                title: scriptFile.name,
                                date: 'SCRIPT',
                                tags: ['_DENKUISCRIPT']
                            })
                        })
            
                        
                        logger.info('KfTodoController ', infos)
                        
                        const resData = {
                            headerInfos: infos.concat([item])
                        }

                        const otherDatas = listDataRes.data.headerInfos.filter((header:HeaderInfo) => {
                            return header.type != undefined
                        })
                        resData.headerInfos = resData.headerInfos.concat(otherDatas)
                        await storage.set({ key: 'listData', value: resData }); 
                        this.send({
                            name: 'initData',
                            data: resData,
                        })

                        ipcData.msg = `initData by config success`
                        this.ipc?.response(ipcData)
                    } catch (err) {
                        logger.info('KfTodoController', err)
                        ipcData.data = {
                            error: 'error: ' + err
                        }
                        this.ipc?.response(ipcData)
                    }
                } else {
                    try {
                        let info:HeaderInfo = ReadBlog.handleFile(content, path);
                        item.title = info.title
                        item.date = info.date
                        item.path = info.path
                        item.tags = info.tags
                        ipcData.msg = `${ipcData.data.invokeName} success`
                    } catch (err) {
                        ipcData.data = {
                            error: 'error: ' + err
                        }
                        this.ipc?.response(ipcData)
                        return
                    }
                    await storage.set({ key: 'listData', value: listDataRes.data });
                    this.ipc?.response(ipcData)
                }
            } 
        }
        if (invokeName === 'deleteItem') {
            const { path } = invokeData
            const listDataRes = await storage.get({ key: 'listData' })
            const hitItems = listDataRes.data.headerInfos.filter((item :any) => {
                if (item.path == path) {
                    logger.info('KfTodoController deleteItem', path)

                }
                return item.path != path
            })
            listDataRes.data.headerInfos = hitItems
            await storage.set({ key: 'listData', value: listDataRes.data });
            
            this.ipc?.response(ipcData)
        }
        if (invokeName === 'getNewBlogTemplate') {
            const content = BlogTextHelper.GenerateEmptyText();
            ipcData.data = {
                content,
                path: this.config.basePath
            }
            this.ipc?.response(ipcData);
        }


        // 约定：在config.filterFiles 字段得到文件类型
        /**     
            "filterFiles": [{
                "type":"denkuiblog",
                "ext": "md"
            }, { 
                "type": "text",
                "ext": "js"
            }]
         */
        if (invokeName === 'initData') {
            const { path } = invokeData
            const files = fs.walkDirSync(path)
            const denkuiblogFiles = files.filter((value) => {
                const ext = ConfigManager.getFileExtByType('denkuiblog', this.config)
                return value.name.endsWith(ext)
            })

            let headerInfos: HeaderInfo[] = denkuiblogFiles.map((value):HeaderInfo => {
                return ReadBlog.handleFile(fs.readFileSync(value.path), value.path)
            })

            const scriptFiles = files.filter((value) => {
                return value.name.endsWith(ConfigManager.getFileExtByType('script', this.config))
            })
            logger.info('KfTodoController scriptFiles', scriptFiles)

            scriptFiles.forEach((scriptFile) => {
                headerInfos.push({
                    path: scriptFile.path,
                    title: scriptFile.name,
                    date: 'SCRIPT',
                    tags: ['_DENKUISCRIPT']
                })
            })
            

            ipcData.data = {headerInfos}
            await storage.set({ key: 'listData', value: ipcData.data });
            this.ipc?.response(ipcData)

        }


        this.rssController.tryHandleInvoke(ipcData)
    }

    onMessage(message: string) {
        logger.info('KfTodoController onMessage', message)
        if (!this.hasFirstConnect) {
            this.hasFirstConnect = true
        }

        try {
            const event = JSON.parse(message)

            logger.info('KfTodoController onMessage event', event)
            if (event.name === 'onFirstConnect') {
                this.initData().catch(reason => {
                    event.data = {
                        error: reason + ''
                    }
                    this.ipc?.response(event)
                });
            }

            if (event.name === 'invoke') {
                this.handleInvoke(event as AsyncIpcData).catch(reason => {
                    event.data = {
                        error:  reason +''
                    }
                    this.ipc?.response(event)
                });
            }
        } catch (err) {
            logger.info('KfTodoController onMessage err', err)
        }
    }
}