/*
 * @Author: kfdykme
 */
/**
 * system.router
 * TODO:
 * |- 一个路由栈
 * |- push
 * |- pop
 * |- replace
 */

import logger from '@/log/console.ts'
import {FileLoader} from '@/core/loader/FileLoader.ts'
import {UxLoader} from '@/core/loader/UxLoader.ts'
import {AppLoader} from '@/core/loader/AppLoader.ts'
import LifeCycleController from '@/core/LifeCycleController.ts'
 
let count = 0
let pageStack:any[] = []
let pageMap = {};
let app : AppLoader;
let uxLoader = new UxLoader();

let components:any[] = [];

export enum Mode {
    PUSH,
    REPLACE
}

/**
 * replace
 * @param obj 
 */
const replace = async (obj:any) => {
    logger.info('ROUTER.replace',obj, ++count)
        
    let appPage = await uxLoader.load(obj.uri, app)
    pageStack.pop()
    await addPageIntoStack(appPage, Mode.REPLACE)
    // pageStack.forEach((i:any) => {
    //     logger.info(i)
    // })
    logger.info('ROUTER replace end')
    return appPage
}

const attach = async (page:any, mode:Mode) => {
    return await  LifeCycleController.getInstance()
    .attachView(page, mode)
}

const addPageIntoStack = async (page:any, mode:Mode = Mode.PUSH) => {
    pageStack.push(page)
  
    app.currentPage = page
    logger.info("SYSTEM.ROUTER", "addPageIntoStack :", app.currentPage)
 
    await attach(page, mode)

    app.currentPage.onInit && app.currentPage.onInit()

    // 处理组件
    try {
        
        app.currentPage.components = app.currentPage?._view?.components?.map(async (view:any) => {
            let comp = await uxLoader.loadComponent(app.currentPage, view.src, app)
            console.info("SYSTEM.ROUTER init components:",
            view.src, comp) 

            comp.onInit && comp.onInit()
            return comp
        })
        
    } catch (err) {
        console.info("SYSTEM.ROUTER addPageIntoStack error while initComponent", err)
    }


}

const push = async (obj:any) => {
    logger.info("ROUTER push",obj) 
    let appPage = await uxLoader.load(obj.uri, app)

    await addPageIntoStack(appPage)
    
    pageStack.forEach((i:any) => {
        logger.info(i)
    })
    logger.info('ROUTER push end')
    return appPage
}

const init = (obj:AppLoader) => {
    app = obj
}

export default {
    replace,
    push,
    init
}