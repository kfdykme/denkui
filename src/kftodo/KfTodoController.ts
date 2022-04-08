import IpcController from "@/ipc/IpcController.ts"
import storage from '@/system.storage.ts'
import logger from '@/log/console.ts'
import fs from '@/common/common.fs.ts'
import { AsyncIpcController } from "@/ipc/AsyncIpcController.ts"
import { AsyncIpcData } from "@/ipc/AsyncIpcController.ts"
import ReadBlog, { HeaderInfo } from "@/kftodo/ReadBlog.ts"
import Path from '@/common/common.path.ts'

interface IEventData {
    name: string
    data: string
}

export default class KfTodoController {

    ipc: AsyncIpcController | null = null

    hasFirstConnect = false

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

            // const dataIndexConfigPath = 'C:\\Users\\wimkf\\Desktop\\wor\\blog\\result.json'
            
            // const content = fs.readFileSync(dataIndexConfigPath)
            // listDataRes.data = JSON.parse(content)

            // // logger.info('KfTodoController', 'initData', dataIndexConfigPath, content)
            // await storage.set({ key: 'listData', value: listDataRes.data })
            listDataRes.data = []
        }

        this.send({
            name: 'initData',
            data: listDataRes.data
        })
    }

    async handleInvoke(ipcData: AsyncIpcData) {
        const { invokeName, data:invokeData } = ipcData.data
        if (invokeName === 'readFile') {
            const content = fs.readFileSync(invokeData)
            ipcData.data = {
                content,
                path: invokeData
            }
            this.ipc?.response(ipcData)
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
                listDataRes.data.headerInfos.push(item)
            } else {
                item = hitItems[0]
            }

            try {
                let info:HeaderInfo = ReadBlog.handleFile(content, path);
                item.title = info.title
                item.date = info.date
                item.path = info.path
                item.tags = info.tags
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
            const content = 
`---
title: UnNamed
date: ${new Date().toLocaleString()}
tags:
---









`
            ipcData.data = {
                content
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
                // this.initData()
            }

            if (event.name === 'invoke') {
                this.handleInvoke(event as AsyncIpcData);
            }
        } catch (err) {
            logger.info('KfTodoController onMessage err', err)
        }
    }
}