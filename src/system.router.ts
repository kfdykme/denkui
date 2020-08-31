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

import logger from './log/console.ts'
import {FileLoader} from './core/FileLoader.ts'
import {AppLoader} from './core/AppLoader.ts'
import LifeCycleController from './core/LifeCycleController.ts'
 
let count = 0
let pageStack:any[] = []
let pageMap = {};
let app : AppLoader;



/**
 * replace
 * @param obj 
 */
const replace = async (obj:any) => {
    logger.info('ROUTER.replace',obj, ++count)
    
    let result = FileLoader.getInstance().loadRoute(obj.uri)
    let p = '../' + result.path
    let module = await import(p)
    
    logger.info('ROUTER replace import', p)
    let appPage = module.default 

    pageStack.pop()
    addPageIntoStack(appPage)
    // pageStack.forEach((i:any) => {
    //     logger.info(i)
    // })
    logger.info('ROUTER replace end')
    return appPage
}

const attach = async (page:any) => {
    return await  LifeCycleController.getInstance()
    .attachView(page)
}

const addPageIntoStack = async (page:any) => {
    pageStack.push(page)
    app.currentPage = {
        ...page,
    ...page.protected}
    app.currentPage.$app = app.app
    
    await attach(page)

    page.onInit()
}

const push = async (obj:any) => {
    logger.info("ROUTER push",obj)
    let uri = obj.uri 

    let result = FileLoader.getInstance().loadRoute(uri)
    
    let p = '../' + result.path
    let module = await import(p)
    
    logger.info('ROUTER push import', p)
    let appPage = module.default 
    appPage._view = result.view 
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