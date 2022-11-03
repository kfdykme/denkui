// import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import logger from '@/log/console.ts'

interface IOnMessageCallbackFunction {
    (message: string): void
}

export interface IpcData {

} 

interface LibSocketData {
    kind: String
    value: any
}



export default class IpcController {
    
    // wss:WebSocketServer
    // ws:WebSocketClient|null = null
    // @ts-ignore
    ls:LibSocket
    callbacks:Function[] = []
    onConnected:Function[] = []
    hasConnected = false
    constructor(port:number) {
        // @ts-ignore
        this.ls = new LibSocket()
        
        this.ls.onData((data:LibSocketData) => {
            logger.info('IpcController on libsocket message', data)
            const { value:message} = data
            if (!this.hasConnected) {
                this.hasConnected = true
                this.onConnected.forEach((i: Function) => i())
                return
            }
            this.callbacks.forEach((i:Function) => {
                i(message)
            })
        })
        
    }
 

    send(data:any) {
        data && this.ls?.send(data)
        this.ls.start();
    }
 
    addOnConnectCallback(callback: Function) {
        this.onConnected.push(callback);
    }

    addCallback(callback:IOnMessageCallbackFunction) {
        // this.callbacks.set(key,callback)
        this.callbacks.push(callback)
    }
}