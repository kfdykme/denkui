import { WebSocket, WebSocketServer } from "https://deno.land/x/websocket@v0.0.3/mod.ts";

const wss = new WebSocketServer(8080);
wss.on("connection", function (ws: WebSocket) {
  ws.on("message", function (message: string) {
    console.log(message);
    ws.send(message)
  });
});

export default class IpcController {
    
    wss:WebSocketServer
    ws:WebSocket|null = null
    callbacks:Function[] = []

    constructor(port:number) {
        this.wss = new WebSocketServer(port)
        this.wss.on("connection", (ws: WebSocket) => {
            this.ws = ws
            console.info('IpcController ws connection success')
            this.ws.on("message", (message:any) => { 
                console.info(message)
                 
                this.callbacks.forEach((i:Function) => { 
                    i(message)
                })
            })
        })
    }

    send(data:any) {
        this.ws?.send(data)
    }
 
    addCallback(callback:Function) {
        this.callbacks.push(callback)
    }


}