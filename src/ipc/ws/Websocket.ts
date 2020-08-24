import { WebSocket, WebSocketServer } from "https://deno.land/x/websocket@v0.0.3/mod.ts";

const wss = new WebSocketServer(8080);

wss.on("connection", function (ws: WebSocket) {
    ws.on("message", function (message: string) {
      console.log(message);
      ws.send(message)
    });
  });


export default {
    wss
}