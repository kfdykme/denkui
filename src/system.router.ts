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
import {UxLoader} from './core/loader/UxLoader.ts'
import {AppLoader} from './core/AppLoader.ts'
import LifeCycleController from './core/LifeCycleController.ts'
 
let count = 0
let pageStack:any[] = []
let pageMap = {};
let app : AppLoader;
let uxLoader = new UxLoader();


/**
 * replace
 * @param obj 
 */
const replace = async (obj:any) => {
    logger.info('ROUTER.replace',obj, ++count)
        
    let appPage = await uxLoader.load(obj.uri, app)
    pageStack.pop()
    await addPageIntoStack(appPage)
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
  
    app.currentPage = page
    console.info("SYSTEM.ROUTER addPageIntoStack :", app.currentPage)
 
    await attach(page)

    app.currentPage.onInit()
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