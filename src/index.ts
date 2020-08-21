import {FileReader} from './fileReader'
// import Fs from 'fs'
const Fs = require('fs')

const MIDDLE_PATH = './intermediate/'
const MIDDLE_JS_PATH = MIDDLE_PATH + 'js/'
const START_FILE_NAME = 'app'
const FILE_TYPE_JS  = '.js'
const FILE_TYPE_UX = '.ux'
const SOURCE_ROOT_PATH = '../src/'
const FILE_MANIFEST_JSON_NAME = 'manifest.json'

const fileReader = new FileReader();

let manifest = fileReader.readJsonFileSync(SOURCE_ROOT_PATH + FILE_MANIFEST_JSON_NAME) 
let scriptContent = fileReader.readFileSync(SOURCE_ROOT_PATH + START_FILE_NAME + FILE_TYPE_UX)


let test = "\\Start\\Login\\index.ux"
// let test = '/app.ux'

let pages = {}

let loadPage = async (routeName:string, route:any) => {
    let path = routeName + '/' + route.component
    logger.info(SOURCE_ROOT_PATH + path + FILE_TYPE_UX)
    let page = fileReader.
    readFileSync(SOURCE_ROOT_PATH + path + FILE_TYPE_UX)
    let outJsPath = MIDDLE_JS_PATH + path + FILE_TYPE_JS
    Fs.mkdirSync(MIDDLE_JS_PATH + routeName, {recursive: true})
    // logger.info(outJsPath)
    Fs.writeFileSync(outJsPath,  page.script ? page.script.content : "//empty")
   
// logger.info( page)
    logger.info(Fs.readdirSync('./'))
   import(outJsPath)
   .then(module => {
       logger.info(module)
   }).catch(e => {
       logger.error(e)
   })
    // logger.info(module)
    // module.default.onInit()
    // module.default.doLogin()
}
 
// logger.info(result)
// (async () => {
//     for(let x in 
//         manifest.router.pages) {
//             await loadPage(x, 
//                 manifest.router.pages[x])
//         }
// })()

loadPage("Start/Login",{ component: "index"})
