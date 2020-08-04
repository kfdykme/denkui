// import a from './intermediate/js/Start/Login/index.js';

let path = './intermediate/js/Start/Login/index.js';


// 只要保证引入的内容没有问题,是完全可以import一个js/ts的
// let module = await import(path)
// console.info(module)

// module.default.doLogin()

import {FileLoader} from './FileLoader.ts'

let result = FileLoader.getInstance().load(path)

console.info(result)
