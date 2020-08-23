import IpcController from '../ipc/IpcController.ts'


let ipc:IpcController = new IpcController(8089);

ipc.addCallback((message:string) => {
    console.info('callback',message)
})


setInterval(() => {
    ipc.send(new Date().toString());
},1000)
