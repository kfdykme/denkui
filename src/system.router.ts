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

import {FileLoader} from './core/FileLoader.ts'
let count = 0
let pageStack:any[] = []
let pageMap = {}

/**
 * replace
 * @param obj 
 */

const replace = async (obj:any) => {
    console.info('ROUTER.replace',obj, ++count)
    
    let result = FileLoader.getInstance().loadRoute(obj.uri)
    let p = '../' + result.path
    let module = await import(p)
    
    console.info('ROUTER replace import', p)
    let appPage = module.default 

    pageStack.pop()
    pageStack.push(appPage)
    pageStack.forEach((i:any) => {
        console.info(i)
    })
    console.info('ROUTER replace end')
    return appPage
}

const push = async (obj:any) => {
    console.info("ROUTER push",obj)
    let uri = obj.uri 

    let result = FileLoader.getInstance().loadRoute(uri)
    
    let p = '../' + result.path
    let module = await import(p)
    
    console.info('ROUTER push import', p)
    let appPage = module.default 

    pageStack.push(appPage)
    pageStack.forEach((i:any) => {
        console.info(i)
    })
    console.info('ROUTER push end')
    return appPage
}

export default {
    replace,
    push
}