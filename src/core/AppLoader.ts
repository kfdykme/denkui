/*
 * @Author: kfdykme
 */

import {FileLoader} from './FileLoader.ts'

export class AppLoader{
    
    appPath :string = ''
    rootPath : string = ''
    constructor() {
        this.rootPath = Deno.cwd()
    }

    async load(appPath:string) {
        appPath = '../../' +FileLoader.getInstance().load(appPath).path
        console.info('AppLoader load', appPath)
        // console.info('AppLoader load', this.rootPath)
        let appModule = await import(appPath)
        console.info(appModule)
    }
}