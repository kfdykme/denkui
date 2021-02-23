import IpcController from '@/ipc/IpcController.ts';
import {AppLoader} from '@/core/loader/AppLoader.ts';
import {DataBinder,UxData} from '@/core/binder/DataBinder.ts'
import logger from '@/log/console.ts'
import {Mode} from '@/system.router.ts'

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

    static currentPage():UxData|null {
        return sInstance? sInstance.currentPage : null
    }

    constructor () {
        this.ipc = null
        let updateView = (key :string,value: any) => {
            this.currentPage?.replace(key, value)
            const renderViewData = LifeCycleController.currentPage()?.renderView()
            logger.info("LifeCycleController UPDATE_VIEW_RENDER_VIEW ->",renderViewData)
            this.ipc?.send(JSON.stringify({
                method:'RENDER_VIEW',
                data:renderViewData
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
            // .addGetCallback(updateView)
    }

    emptyFunction() {
        logger.info("LifeCycleController emptyFunction()")
    }

    getCurrentPageMethod(method:any) {
        if (this.currentPage == null) {
            return this.emptyFunction
        }
     
        if (typeof (this.currentPage as any)[method] == 'function') {
            return (this.currentPage as any)[method]
        }

        return this.emptyFunction
    }

    invoke(method: String, event:any) {
        logger.info("LifeCycleController try invoke: ", method)
        let methodFunc:Function = this.getCurrentPageMethod(method)
        logger.info(methodFunc)
        methodFunc.call(this.currentPage, event) 
     
        logger.info("LifeCycleController try invoke end: ", method) 
    }

    handleEvent(event: any) {
        console.info("HANDLE ", event)
        if (event['mod'] == 'invoke') {
            let value:any = event['param']
            try {
                value = JSON.parse(event['param'])
            } catch (error) {
                // console.error(error)
                if (value[0] == '\'')
                    value = value.replace(/'(.*)'/,'$1')
                else if (value[0] == '\"')
                    value = value.replace(/"(.*)"/,'$1')
            }
            console.info('HADNLE value', value)
            
            this.invoke(event['function'], value)
        }
    }

    prompt(o:any) {
        this.ipc?.send(JSON.stringify({
            method: 'PROMPT',
            data: o?.message
        }))
    }

    start() {
        logger.info("LifeCycleController start.")
        this.ipc = new IpcController(8082)
        logger.info("LifeCycleController waiting flutter response.")
        
        this.ipc.addCallback((message:string) => { 
            if (message === 'DENKUI_START') {
                this.onAttach()
                return
            }

            if (message === 'DENKUI_ON_ATTACH_VIEW_END') {
                this.attachViewCallback && this.attachViewCallback()
                return 
            }
            let jsonMessage:any|null = null
           try {
               jsonMessage = JSON.parse(message)
            } catch(error) {
              logger.error(error, message)
             }

           if (jsonMessage != null) {
               this.handleEvent(jsonMessage)
           } 
        })
        // this.ipc.addCallback((msg:string) => {
        //     logger.info(msg)
        // })
    }


    onAttach() {
        logger.info("LifeCycleController onAttach.");
        this.ipc?.send(JSON.stringify({
            method: 'UPDATE_STATE',
            data: 'DENO_IS_OK'
        }))

        let appLoader = new AppLoader();

        appLoader.loadApp('app.ux')
    }

    async attachView(appPage:any, mode:Mode = Mode.PUSH) {
        this.currentPage = appPage
        return new Promise<void>((reslove, rejcet) => {
            this.attachViewCallback =  () => {
                reslove()
            }
            this.ipc?.send(JSON.stringify({
                method: mode === Mode.PUSH ?
                    'RENDER_VIEW' :
                    'RENDER_VIEW_REPLACE',
                data:appPage?.renderView()
            }))
    
        })

    }
}