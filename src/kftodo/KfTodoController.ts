import IpcController from "@/ipc/IpcController.ts"
import storage from '@/system.storage.ts'
import logger from '@/log/console.ts'
import fs from '@/common/common.fs.ts'
import { AsyncIpcController } from "@/ipc/AsyncIpcController.ts"
import { AsyncIpcData } from "@/ipc/AsyncIpcController.ts"
import ReadBlog, { HeaderInfo } from "@/kftodo/ReadBlog.ts"
import Path from '@/common/common.path.ts'
import {BlogTextHelper} from '@/kftodo/blog/BlogTextHelper.ts'

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
    }

    heart() {
        !this.hasFirstConnect && this.ipc?.send(JSON.stringify({
            name: 'heart',
            data: 'KfTodoController ' + !this.hasFirstConnect
        }))
    }

    send(event: IEventData) {
        this.ipc?.send(JSON.stringify(event))
    }

    async initData() {
        logger.info('KfTodoController', 'initData')
        const listDataRes = await storage.get({ key: 'listData' })
        if (!listDataRes.data) {
            const confgPath = KfTodoController.KFTODO_CONFIG_MD_PATH
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
                this.config = JSON.parse(BlogTextHelper.GetContentFromText(currentConfigContent))
                item = ReadBlog.handleFile(currentConfigContent, confgPath)
            }
            listDataRes.data = {
                headerInfos: [item]
            }
            await storage.set({ key: 'listData', value: listDataRes.data})
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
        if (invokeName === 'writeFile') {
            const { content, path} = invokeData
            fs.mkdirSync(Path.getDirPath(path), { recursive: true})
            fs.writeFileSync(path, content);
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

            if (path === KfTodoController.KFTODO_CONFIG_MD_PATH) {
                try { 
                    const configContent = BlogTextHelper.GetContentFromText(content).trim()
                    logger.info('KfTodoController ', configContent)
                    this.config = JSON.parse(configContent) 
                    const files = fs.walkDirSync(this.config.basePath).filter((value) => {
                        return value.name.endsWith('.md')
                    })
                    
                    const infos = files.map(i => {
                        logger.info('KfTodoController ', i)
                        return ReadBlog.handleFile(fs.readFileSync(i.path), i.path)
                    }).filter(i => {
                        return i.title
                    })
                    logger.info('KfTodoController ', infos)

                    const resData = {
                        headerInfos: infos.concat([item])
                    }
                    await storage.set({ key: 'listData', value: resData }); 
                    this.send({
                        name: 'initData',
                        data: resData,
                    })
                } catch (err) {
                    logger.info('KfTodoController', err)
                    ipcData.data = {
                        msg: 'error: ' + err
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
                        msg: 'error: ' + err
                    }
                    this.ipc?.response(ipcData)
                    return
                }
                await storage.set({ key: 'listData', value: listDataRes.data });
                this.ipc?.response(ipcData)
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

        if (invokeName === 'initData') {
            const { path } = invokeData
            
        }
    }

    onMessage(message: string) {
        logger.info('KfTodoController onMessage', message, this)
        if (!this.hasFirstConnect) {
            this.hasFirstConnect = true
        }

        try {
            const event = JSON.parse(message)

            logger.info('KfTodoController onMessage event', event)
            if (event.name === 'onFirstConnect') {
                this.initData()
            }

            if (event.name === 'invoke') {
                this.handleInvoke(event as AsyncIpcData);
            }
        } catch (err) {
            logger.info('KfTodoController onMessage err', err)
        }
    }
}