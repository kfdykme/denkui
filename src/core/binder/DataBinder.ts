
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

    map:Map<String,boolean> = new Map()

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
            console.info("DataBinder bind data ", x, 'has defined: ', this.map.get(x))
            if (this.map.get(x) === undefined || 
                this.map.get(x) === false)

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
                this.map.set(x, true)
        }
        for (let x in page.protected) {
            (page as any)[x]
        }

        if (this.map.get('$app') === undefined || 
        this.map.get('$app') === false) {
            Object.defineProperty(page, '$app', {
                set: function (value) {
                    console.info("Can't change $app")
                },
                get: function () {
                    return app.app
                }
            })
        }
        this.map.set('$app', true)
    }
}
 