import {FileLoader} from '../FileLoader.ts'
import {DataBinder} from '../binder/DataBinder.ts'
import logger from '../../log/console.ts'

export class UxLoader {

    constructor() {

    }

    async load(uri:string, app:any) {
        let result =  FileLoader.getInstance().loadRoute(uri)        
        let p = '../../../' + result.path 
        logger.info('UxLoader load import', p)
        let module = await import(p)
        
        let page = module.default 
        page._view = result.view 
   
        DataBinder.getInstance().bind(page, app)

        return page
    }
}