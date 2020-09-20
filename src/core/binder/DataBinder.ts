import { View } from "../../data/View.ts"
import logger from '../../log/console.ts'
let sInstance:DataBinder|null = null

export declare interface UxData {
    protected: any
    public: any
    _route:string
    _view:View
    replace:Function
    renderView:Function
}

declare interface Application {
    app: any
}


export class DataBinder {


    setCallbacks:Function[] = []

    getCallbacks:Function[] = []

    map:Map<String,boolean> = new Map()

    constructor(){

    }

    static getInstance() {
        if (sInstance == null) {
            sInstance = new DataBinder()
            sInstance.addSetCallback((key:string,value:string) => {
                logger.info("DataBinder bind data SET :", key, "->",value)
            })
            sInstance.addGetCallback((key:string,value:string) => {
                logger.info("DataBinder bind data GET :", key, "->", value)    
            })
        }
        return sInstance
    }
    

    addCallback(key:string, callback:Function):DataBinder {
        if (key === 'set') {
            return this.addSetCallback(callback)
        } else if (key === 'get') {
            return this.addGetCallback(callback)
        }
        return this
    }

    addSetCallback(callback:Function):DataBinder {
        this.setCallbacks.push(callback)
        return this
    }

    addGetCallback(callback:Function):DataBinder {
        this.getCallbacks.push(callback)
        return this
    }
    
    _innerBind(page:any, app:Application, type:string) {
        let dataBinder = this
        for (let x in page[type]) {
            logger.info("DataBinder bind data ", x, 'has defined: ', this.map.get(x))
            if (this.map.get(x) === undefined || 
                this.map.get(x) === false)

                Object.defineProperty(page, x, {
                    set: function(value) {
                        page[type][x] = value
                        logger.info(`DataBinder on set page._view == null:${page._view == null}:${x}->${value}`)
                        page._view?.replace(x, value)
                        //callback 
                        dataBinder.setCallbacks.forEach((f:Function) => f(x,value))
                    },
                    get: function() {
                        let value = page[type][x]
                        
                        logger.info(`DataBinder on get page._view == null:${page._view == null}:${x}->${value}`)
                        page._view?.replace(x, value)
                        dataBinder.getCallbacks.forEach((f:Function) => f(x, value))
                        return value
                    }
                })
                this.map.set(x, true)
        } 
        for (let x in page[type]) {
            // bind data to view 
            page._view.replace(x, (page as any)[x])
        }
    }

    bind(page:UxData, app:Application) {
        //bind data 
        this._innerBind(page, app, 'protected')
        this._innerBind(page, app, 'public')

        if (this.map.get('$app' + page._route) === undefined || 
        this.map.get('$app' + page._route) === false) 
        {
            Object.defineProperty(page, '$app', {
                set: function (value) {
                    // dataBinder.getCallbacks.forEach((f:Function) => f('$app', value))
                    logger.info("Can't change $app")
                },
                get: function () {
                    // dataBinder.setCallbacks.forEach((f:Function) => f('$app',app.app))
                    return app.app
                }
            })
 
        }
        this.map.set('$app' + page._route, true)
    }
}
 