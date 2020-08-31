import { WebSocket, WebSocketServer } from "https://deno.land/x/websocket@v0.0.3/mod.ts";

export default class IpcController {
    
    wss:WebSocketServer
    ws:WebSocket|null = null
    callbacks:Function[] = []


    constructor(port:number) {
        this.wss = new WebSocketServer(port)
        console.info("IpcController init at port ", port)
        this.wss.on("connection", (ws: WebSocket) => {
            this.ws = ws
            console.info('IpcController ws connection success at', new Date())
            this.ws.on("message", (message:any) => { 
                console.info('IpcController on message', message)
                console.info('IpcController callbacks:', this.callbacks)
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
        console.info("IpcController send type:", typeof data,'data', data)
        data && this.ws?.send(data)
    }
 
    addCallback(callback:Function) {
        // this.callbacks.set(key,callback)
        this.callbacks.push(callback)
    }


}