
let sInstance:DataBinder|null = null

declare interface UxData {
    protected: any
}

declare interface Application {
    app: any
}


export class DataBinder {


    setCallbacks:Function[] = []

    getCallbacks:Function[] = []

    constructor(){

    }

    static getInstance() {
        if (sInstance == null) {
            sInstance = new DataBinder()
            sInstance.addSetCallback((key:string,value:string) => {
                console.info("DataBinder bind data SET :", key, "->",value)
            })
            sInstance.addGetCallback((key:string,value:string) => {
                console.info("DataBinder bind data GET :", key, "->", value)    
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

    bind(page:UxData, app:Application) {
        //bind data 
        let dataBinder = this
        for (let x in page.protected) {
        console.info("DataBinder bind data ", x)
        Object.defineProperty(page, x, {
            set: function(value) {
                page.protected[x] = value
                
                //callback 
                dataBinder.setCallbacks.forEach((f:Function) => f(x,value))
            },
            get: function() {
                let value = page.protected[x]
                dataBinder.getCallbacks.forEach((f:Function) => f(x, value))
                return value
            }
        })
        }
        for (let x in page.protected) {
            (page as any)[x]
        }
        Object.defineProperty(page, '$app', {
            set: function (value) {
                console.info("Can't change $app")
            },
            get: function () {
                return app.app
            }
        })
    }
}
 