import {FileLoader} from '../FileLoader.ts'
import {DataBinder, UxData} from '../binder/DataBinder.ts'
import logger from '../../log/console.ts'
import { View } from '../../data/View.ts'
 
export class UxLoader {

    constructor() {

    }


    async load(uri:string, app:any) {
        let result =  FileLoader.getInstance().loadRoute(uri)        
        let p = '../../../' + result.path 
        logger.info('UxLoader load import', p)
        let module = await import(p)
        
        let page = module.default 
        page._route = result.route
        page._view = result.view         
        page.replace = function (key:string, value:any) {
            this._view.replace(key, value)
        }

        page.renderView = function() { 
            return this._view.toString();
        }

        DataBinder.getInstance().bind(page, app)

        return page
    }
}