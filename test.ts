/*
 * @Author: kfdykme
 */
// import a from './intermediate/js/Start/Login/index.js';

let path = 'Start/Login/login.js';
let pathApp = 'app.js'

// 只要保证引入的内容没有问题,是完全可以import一个js/ts的
// let module = await import(path)
// console.info(module)

// module.default.doLogin()

import {FileLoader} from './FileLoader.ts'

let result = FileLoader.getInstance().load(path)

console.info(result)
console.info('load')
let module = await import(result.path)
let loginApp = module.default 

let appModule = await import(
    FileLoader.getInstance().load(pathApp).path
)
let app = appModule.default
app.$def = app
loginApp.protected.username = 'kfdykme'
loginApp.protected.password = 'Fangmunianhua2'
let loginAppData = {
    ...loginApp.protected
}
loginApp = {
    ...loginApp,
    ...loginAppData,
    $app : app
}
console.info(loginApp)
console.info(loginApp.doLogin())