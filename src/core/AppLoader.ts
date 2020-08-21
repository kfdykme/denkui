/*
 * @Author: kfdykme
 */

import {FileLoader} from './FileLoader.ts'
import ManifestLoader from './ManifestLoader.ts'
import router from '../system.router.ts'

export class AppLoader{
    
    appPath :string = ''
    rootPath : string = ''
    manifest :any 
    constructor() {
        this.rootPath = Deno.cwd()

        console.info("AppLoader",this.rootPath )
        this.manifest = new ManifestLoader(this.rootPath+ "\\..\\src\\").get()
        
    }

    async load(appPath:string) {
        appPath = '../../' +FileLoader.getInstance().load(appPath).path
        console.info('AppLoader load', appPath)
        // console.info('AppLoader load', this.rootPath)
        let appModule = await import(appPath)
        let app = appModule.default
        let entry = this.manifest.router.entry
        app.hookCreate = () => {
            app.onCreate()
            router.push({
                uri: entry
            })
        }
        console.info(app)
        app.hookCreate()
    }
}