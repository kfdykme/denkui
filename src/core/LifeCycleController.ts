import IpcController from '../ipc/IpcController.ts';
import {AppLoader} from '../core/AppLoader.ts';
import {DataBinder,UxData} from '../core/binder/DataBinder.ts'


let sInstance:LifeCycleController|null = null

export default class LifeCycleController {

    ipc:IpcController|null 
    attachViewCallback:Function|null = null
    currentPage:UxData|null = null

    static getInstance ():LifeCycleController {
        if (sInstance === null) {
            sInstance = new LifeCycleController()
        }
        
        return sInstance;
    }

    constructor () {
        this.ipc = null
        let updateView = (key :string,value: any) => {
            this.currentPage?.replace(key, value)
            console.info("UPDATE_VIEW_RENDER_VIEW ->", this.currentPage)
            this.ipc?.send(JSON.stringify({
                method:'RENDER_VIEW',
                data: this.currentPage?.renderView()
            }))
            // this.ipc?.send(JSON.stringify({
            //     method: "UPDATE_VIEW",
            //     data: {
            //         key: key,
            //         value: value
            //     }
            // }))
        }
        DataBinder.getInstance()
            .addSetCallback(updateView)
            .addGetCallback(updateView)
    }

    start() {
        console.info("LifeCyclerController start.")
        this.ipc = new IpcController(8082)
        console.info("LifeCyclerController waiting flutter response.")
        
        this.ipc.addCallback((message:string) => {
            if (message === 'DENKUI_START') {
                this.onAttach()
            }

            if (message === 'DENKUI_ON_ATTACH_VIEW_END') {
                this.attachViewCallback && this.attachViewCallback()
            }
        })
        // this.ipc.addCallback((msg:string) => {
        //     console.info(msg)
        // })
    }


    onAttach() {
        console.info("LifeCycleController onAttach.");
        this.ipc?.send(JSON.stringify({
            method: 'UPDATE_STATE',
            data: 'DENO_IS_OK'
        }))

        let appLoader = new AppLoader();

        appLoader.load('app.ux')
    }

    async attachView(appPage:any) {
        this.currentPage = appPage
        return new Promise((reslove, rejcet) => {
            this.attachViewCallback =  () => {
                reslove()
            }
            this.ipc?.send(JSON.stringify({
                method:'RENDER_VIEW',
                data:appPage?.renderView()
            }))
    
        })

    }
}