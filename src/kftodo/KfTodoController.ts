import IpcController from "@/ipc/IpcController.ts"
import storage from '@/system.storage.ts'
import logger from '@/log/console.ts'
import fs from '@/common/common.fs.ts'
import { AsyncIpcController } from "@/ipc/AsyncIpcController.ts"
import { AsyncIpcData } from "@/ipc/AsyncIpcController.ts"

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
        this.ipc = new AsyncIpcController(iport)

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

            const dataIndexConfigPath = 'C:\\Users\\wimkf\\Desktop\\wor\\blog\\result.json'
            const content = fs.readFileSync(dataIndexConfigPath)
            listDataRes.data = JSON.parse(content)

            // logger.info('KfTodoController', 'initData', dataIndexConfigPath, content)
            await storage.set({ key: 'listData', value: listDataRes.data })
        }

        this.send({
            name: 'initData',
            data: listDataRes.data
        })
    }

    handleInvoke(ipcData: AsyncIpcData) {
        const { invokeName, data:invokeData } = ipcData.data
        if (invokeName === 'readFile') {
            const content = fs.readFileSync(invokeData)
            ipcData.data = {
                content
            }
            this.ipc?.response(ipcData)
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