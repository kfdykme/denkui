/*
 * @Author: kfdykme
 */
// import a from './intermediate/js/Start/Login/index.js';

let path = 'Start/Login';
// let path = 'Main'
let pathApp = 'app.js'

import {AppLoader} from './src/core/AppLoader.ts'

let appLoader = new AppLoader();

appLoader.load('app.ux')

// 只要保证引入的内容没有问题,是完全可以import一个js/ts的
// let module = await import(path)
// console.info(module)

// module.default.doLogin()

// import {FileLoader} from './src/core/FileLoader.ts'
// import router from './src/system.router.ts'
// import {readTag } from './src/core/TagReader.ts'
// // let result = FileLoader.getInstance().load(path)

// // console.info(result)
// // let loginApp = module.default 
// let loginApp = await router.push({
//     uri: path
// })

// let appModule = await import(
//     FileLoader.getInstance().load(pathApp).path
// )
// let app = appModule.default
// app.$def = app
// loginApp.protected.username = 'kfdykme'
// loginApp.protected.password = 'Fangmunianhua2'
// let loginAppData = {
//     ...loginApp.protected
// }
// loginApp = {
//     ...loginApp,
//     ...loginAppData,
//     $app : app
// }
// console.info(loginApp)

// // 测试在不同地方import一个ts后内部的变量的关系
// // import router from './src/system.router.ts'
// // router.replace({ name: 'test'})
// // console.info(loginApp.doLogin())
// loginApp.doLogin()

