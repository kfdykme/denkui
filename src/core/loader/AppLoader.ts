/*
 * @Author: kfdykme
 */

import {FileLoader} from '@/core/loader/FileLoader.ts'
import ManifestLoader from '@/core/loader/ManifestLoader.ts'
import router from '@/system.router.ts'
import logger from '@/log/console.ts'
import Project from '@/project/Project.ts'
const CODE_PATH = 'src/'
export class AppLoader{
    
    appPath :string = ''
    rootPath : string = ''
    manifest :any 
    currentPage: any
    app:any
    _entry:string|undefined = undefined
    constructor() {
        this.beforeInit()
    }

    async beforeInit() {
        this.rootPath = Deno.cwd()
        logger.info("AppLoader",this.rootPath ) 
        let p = await Project.get()
        let tempPath = this.rootPath+ "/" + p.targetSourcePath + CODE_PATH
        this.manifest = new ManifestLoader(tempPath).get()
        router.init(this)
    }

    public entry(entry:string) {
        this._entry = entry
        return this
    }

    async loadApp(appPath:string) {
        await FileLoader.getInstance().init()
        appPath = '../../../' +FileLoader.getInstance().load(appPath).path
        logger.info('AppLoader load', appPath)
        // logger.info('AppLoader load', this.rootPath)
        let appModule = await import(appPath)
        this.app = appModule.default
        let entry = this._entry || this.manifest.router.entry
        logger.info('AppLoader load entry', entry)
        this.app.hookCreate = () => {
            this.app.onCreate && this.app.onCreate()
            router.push({
                uri: entry
            })
        }
        this.app['$def'] = {
            cache: {
                
            }
        }

        router.updateApp(this.app)
        logger.info('AppLoader', this.app)
        this.app.hookCreate()
    }
}