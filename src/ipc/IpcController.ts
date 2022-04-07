import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.3/mod.ts";
import logger from '@/log/console.ts'

interface IOnMessageCallbackFunction {
    (message: string): void
}

export interface IpcData {

} 



export default class IpcController {
    
    wss:WebSocketServer
    ws:WebSocketClient|null = null
    callbacks:Function[] = []
    onConnected:Function[] = []
    constructor(port:number) {
        this.wss = new WebSocketServer(port)
        logger.info("IpcController init at port ", port)
        this.wss.on("connection", (ws: WebSocketClient) => {
            this.ws = ws
            logger.info('IpcController ws connection success at', new Date())
            
            this.onConnected.forEach((i:Function) =>  i())
            
            this.ws.on("message", (message:any) => { 
                logger.info('IpcController on message', message)
                logger.info('IpcController callbacks:', this.callbacks)
                // Array.from(this.callbacks.values()).forEach((i:Function) => { 
                //     i(message)
                // })
                this.callbacks.forEach((i:Function) => {
                    i(message)
                })
            }) 
        }) 
    }
 

    send(data:any) {
        logger.info("IpcController send type:", typeof data,'data', data)
        data && this.ws?.send(data)
    }
 
    addOnConnectCallback(callback: Function) {
        this.onConnected.push(callback);
    }

    addCallback(callback:IOnMessageCallbackFunction) {
        // this.callbacks.set(key,callback)
        this.callbacks.push(callback)
    }
}