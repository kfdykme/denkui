
let sInstance:DataBinder|null = null

declare interface UxData {
    protected: any
}

declare interface Application {
    app: any
}


export class DataBinder {

    constructor(){

    }

    static getInstance() {
        if (sInstance == null) {
            sInstance = new DataBinder()
        }
        return sInstance
    }

    bind(page:UxData, app:Application) {
        //bind data 
        for (let x in page.protected) {
        console.info("DataBinder bind data ", x)
        Object.defineProperty(page, x, {
            set: function(value) {
                page.protected[x] = value
                console.info("DataBinder bind data SET :", x, "->",value)
            },
            get: function() {
                console.info("DataBinder bind data GET :", x, "->", page.protected[x])
                return page.protected[x]
            }
        })
        }
        // for (let x in page.protected) {
        //     page[x]
        // }
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
 