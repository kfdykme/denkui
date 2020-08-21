const DEFAULT_SOURCE_ROOT = '../../bbs-quick/src/'
const Fs = require('fs')
export class ImportLoader {
    source:string 
    target:string
    constructor(importStatement: string,relativePath:string) {
        let pathReg = /import .* from (.*);?(\r\n|\r|\n)/
        let regRes =  importStatement.match(pathReg) 
        regRes[1] = regRes[1].trim()
        this.target = regRes[1].substring(1,regRes[1].length-1) 
        // @system.*
        if (this.target.charAt(0) === '@') {
            this.target = 
            this.target.replace('@','file:///C:/Users/kfmechen/Desktop/wor/bbs-quick/denkui/disk/') 
            + '.js'
        } else {
        // path
        // for example : ../../Common/UserCache
            let targetPath = DEFAULT_SOURCE_ROOT + relativePath + this.target + '.js'
            
            logger.info('ImportLoader','load', targetPath)
            new ScriptFileLoader(targetPath, './intermediate/js/' +relativePath, this.target + '.js')
        }
    }
}

export class ScriptFileLoader {
    content:string
    imports:string[]
    constructor(path:string, middlePath:string, relativePath:string) {
        middlePath = middlePath.replace('../src/','')
        logger.info('ScriptFileLoader', path, middlePath)
        this.content = Fs.readFileSync(path) + ''
        // logger.info('middlePath',)
        // Fs.mkdirSync(MIDDLE_JS_PATH + routeName, {recursive: true})
        let importReg = /import (.*) from (.*);?(\r\n|\r|\n)/g
        // this.imports = this.content.match(importReg).map((importItem: string) => {
        //     new ImportLoader(importItem, )
        //     return importItem
        // }) 
        try {

            let res = Fs.writeFileSync(middlePath + relativePath,this.content)
        } catch (e) {
            logger.error(e)
        }
        logger.info('ScriptFileLoader', path)
    } 
}