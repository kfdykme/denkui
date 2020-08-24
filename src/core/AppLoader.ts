/*
 * @Author: kfdykme
 */

import {FileLoader} from './FileLoader.ts'
import ManifestLoader from './ManifestLoader.ts'
import router from '../system.router.ts'
import logger from '../log/console.ts'
export class AppLoader{
    
    appPath :string = ''
    rootPath : string = ''
    manifest :any 
    currentPage: any
    app:any
    constructor() {
        this.rootPath = Deno.cwd()

        logger.info("AppLoader",this.rootPath )
        this.manifest = new ManifestLoader(this.rootPath+ "\\..\\bbs-quick\\src\\").get()
        router.init(this)
    }

    async load(appPath:string) {
        appPath = '../../' +FileLoader.getInstance().load(appPath).path
        logger.info('AppLoader load', appPath)
        // logger.info('AppLoader load', this.rootPath)
        let appModule = await import(appPath)
        this.app = appModule.default
        let entry = this.manifest.router.entry
        this.app.hookCreate = () => {
            this.app.onCreate()
            router.push({
                uri: entry
            })
        }
        logger.info(this.app)
        this.app.hookCreate()
    }
}