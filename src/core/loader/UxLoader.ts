import { FileLoader } from '@/core/loader/FileLoader.ts'
import { DataBinder, UxData } from '@/core/binder/DataBinder.ts'
import logger from '@/log/console.ts'
import { View } from '@/data/View.ts'

export class UxLoader {

    constructor() {

    }


    /**
     * 加载路由
     * @param uri 在manifest中定义好的路由
     * @param app 
     */
    async load(uri: string, app: any) {
        let result = FileLoader.getInstance().loadRoute(uri)
        let p = '../../../' + result.path
        logger.info('UxLoader load import', p)
        let module = await import(p)

        let page = module.default
        page._route = result.route
        page._view = result.view
        page.replace = function (key: string, value: any) {
            this._view.replace(key, value)
        }

        page.renderView = function () {
            this._view.eval(this)
            return this._view.toString();
        }

        DataBinder.getInstance().bind(page, app)

        return page
    }


    async loadComponent(page:any, path: string, app: any) {
        let comp = await this._loadPath(path, app)

        DataBinder.getInstance().bindComponent(page,comp, app)

        return comp;
    }

    /**
     * 加载路径下的ux文件
     * @param path 
     * @param app 
     */
    async _loadPath(path: string, app: any) {
        console.info('UxLoader loadPath', path)
        let result = FileLoader
            .getInstance()
            .load(path, true)

        // logger.info('UxLoader load import components', result)
        let p = '../../../' + result.path
        logger.info('UxLoader loadPath import components', p)
        let module = await import(p)
        console.info('UxLoader loadPath', module)
        let comp = module.default
        comp._route = path
        comp._view = result.view
        comp.replace = function (key: string, value: any) {
            this._view.replace(key, value)
        }

        comp.renderView = function () {
            this._view.eval(this)
            return this._view.toString();
        }


        return comp
    }
}