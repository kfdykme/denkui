import IpcController from "@/ipc/IpcController.ts";
import { IpcData } from "@/ipc/IpcController.ts";

export interface AsyncIpcData extends IpcData {
    id:string
    isResponse: boolean
    data: any
}

export class AsyncIpcController extends IpcController {

    send(message: string) {
        super.send(message)
    }

    response(data: AsyncIpcData) {
        data.isResponse = true
        this.send(JSON.stringify(data))
    }
}