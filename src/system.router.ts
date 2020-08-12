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
let pageStack = []
let pageMap = {}

/**
 * replace
 * @param obj 
 */

const replace = (obj:any) => {
    console.info('router.replace',obj, ++count)
    
    let result = FileLoader.getInstance().loadRoute(obj.uri)
}

const push = async (obj:any) => {
    console.info("ROUTER push",obj)
    let uri = obj.uri 

    let result = FileLoader.getInstance().load(uri)
    
    console.info('load')
    let module = await import(result.path)
    
    let appPage = module.default 
    pageStack.push(appPage)
    return appPage
}

export default {
    replace,
    push
}