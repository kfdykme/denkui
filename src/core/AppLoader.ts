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
    constructor() {
        this.rootPath = Deno.cwd()

        logger.info("AppLoader",this.rootPath )
        this.manifest = new ManifestLoader(this.rootPath+ "\\..\\src\\").get()
        
    }

    async load(appPath:string) {
        appPath = '../../' +FileLoader.getInstance().load(appPath).path
        logger.info('AppLoader load', appPath)
        // logger.info('AppLoader load', this.rootPath)
        let appModule = await import(appPath)
        let app = appModule.default
        let entry = this.manifest.router.entry
        app.hookCreate = () => {
            app.onCreate()
            router.push({
                uri: entry
            })
        }
        logger.info(app)
        app.hookCreate()
    }
}