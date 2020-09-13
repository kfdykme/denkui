
import ManifestLoader from './ManifestLoader.ts'
import {readTag} from './TagReader.ts'
import logger from '../log/console.ts'
import TagParser from '../parser/TagParser.ts'
import { View } from '../data/View.ts'

const CODE_PATH = 'src/'
const MIDDLE_JS_OUTPUT_PATH = './intermediate/js/' + CODE_PATH
const SOURCE_ROOT_PATH = '../bbs-quick/' + CODE_PATH


let sInstance:FileLoader|null = null
export class FileLoader {
    decoder:TextDecoder
    encoder:TextEncoder
    constructor() { 
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder('utf-8');
    }

    static getInstance() {
        if (sInstance === null) {
            sInstance = new FileLoader()
        }
        return sInstance
    }

    loadRoute(route: string) {
        logger.info('FileLoader loadRoute', route)
        //1 到Manifest去找route的相关内容
        let manifestLoader = new ManifestLoader(SOURCE_ROOT_PATH)
        let o = manifestLoader.get()
        let routerPage = o.router.pages[route]?.component
        
        // 2 load ux 
        let realPagePath = route + '/' + routerPage + '.ux'
        logger.info('FileLoader result', route + '/' + routerPage)
        return this.load(realPagePath)
    }

    /**
     * 
     * @param content ux file content
     * @param path 
     */
    loadUx(path:string) {
        logger.info("FileLoader loadUx", path)
        //1 get script content or src attr 
        let realPath = SOURCE_ROOT_PATH + path
        let tag = readTag('script', realPath)
        logger.info('FileLoader tag', tag,realPath)
        let content = ''
        let targetJsFilePath = ''
        if (tag.content !== '') {
            content = tag.content
            targetJsFilePath = this.getDirPathFromFilePath(path) + 'index.js' 
        } else if (tag.params.src) { 
            let dirPath = this.getDirPathFromFilePath(realPath)
            content = this.decoder.decode(Deno.readFileSync(
                dirPath + tag.params.src
            ))
            targetJsFilePath = this.getDirPathFromFilePath(path) + tag.params.src 
        } else {
            logger.error("FileLoader loadUx", 'fail')
        }

        Deno.mkdirSync(MIDDLE_JS_OUTPUT_PATH +  this.getDirPathFromFilePath(path), { recursive: true})
        Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + targetJsFilePath, this.encoder.encode(content))

        return {
            content: content,
            relativePath: targetJsFilePath
        }
    }

    load(path:string) {
        logger.info('FileLoader load', path)
        //0 find target file from source dir
        let loadPath = SOURCE_ROOT_PATH + path 
        
        logger.info('FileLoader load', 'try load file: ' + loadPath)
        //1 load file content
        let content = new TextDecoder('utf-8').decode(Deno.readFileSync(loadPath))
        //2,3 in loadContent function
        // if is js file
        let res:any 
        logger.info('FileLoader load', 'try write to ' + path)
            if (path.includes('.js')) {
            res = this.loadContent(content, path)
            
            Deno.mkdirSync(MIDDLE_JS_OUTPUT_PATH + this.getDirPathFromFilePath(path), { recursive: true})
            Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + path ,
                this.encoder.encode(res.content))
            return {
                content: res.content,
                path:MIDDLE_JS_OUTPUT_PATH + path
            }
        } else {
        // else if is ux file 
            
        // 1 copy ux file to intermediate
            Deno.mkdirSync(MIDDLE_JS_OUTPUT_PATH + this.getDirPathFromFilePath(path), { recursive: true})
            Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + path ,
                this.encoder.encode(content))

        // 2 load ux file
            res = this.loadUx(path)
            
        //parser tempalte 
            let view:View = TagParser.getInstance().path(loadPath)
        // 3 change path from ux to js
            path = res.relativePath

        // 4 loadContent for a js file
            res = this.loadContent(res.content, path)

        // 5 
            Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + path ,
                this.encoder.encode(res.content))
            return {
                view:view,
                content: res.content,
                path:MIDDLE_JS_OUTPUT_PATH + path
            }
        }
    }

    loadContent(content: string, path:string, level:number = 0) {
        level++
        logger.info('FileLoader loadContent', path)
        // 0 remove moduls can't run in deno
        const regDenoFilter = /\/\/startDeno((\r|\n|\r\n)(.*))*?\/\/endDeno/

        let improts = content.match(regDenoFilter)
        improts?.forEach((imp:string) => {
            content = content.replace(imp,'')
        })
        // 1 filter comments 
        const regComment = / \/\/.*?(\n|\r|\r\n)/g
        improts = content.match(regComment)
        improts?.forEach((imp:string) => {
            // logger.info(imp)
            content = content.replace(imp,'')
        })
        //2 load imports 
        const regImport =  /import +.*? from +(.*);?/g
        improts = content.match(regImport)
        improts?.forEach((imp:string) => {
            const regItem = /import +.*? from +(.*);?/
            let res = regItem.exec(imp)
            logger.info('FileLoader load mport:[' + imp+ ']',path)//,regImport, res)
            if (res &&res?.length > 1) {
                let regTarget = res[1] 
                if (regTarget.startsWith('\'@system')
                || regTarget.startsWith('"@system')) {
                   content = this.loadSystemModule(imp, regTarget, content)
                } else if (regTarget.includes("https")) {
                    // do nothing
                } else if (regTarget.includes('/')){
                    if (level > 1) {
                        content = this.loadOtherModule(imp, regTarget, path.replace(SOURCE_ROOT_PATH,''),content, level)
                    } else {
                        content = this.loadOtherModule(imp, regTarget, path,content, level)
                    }
                }
            } else {
                
             logger.info('res < 1' ,res, res?.length)
            }
        })

        
        //import "./appStatistics.min.js"
        //2.0 some other example
        const regImport2 = /import +('|")(.*)('|")/g
        improts = content.match(regImport2)
        improts?.forEach((imp:string) => {
            const regItem2 = /import +('|")(.*)('|")/
            logger.info("FileLoader load import:[" + imp + "]", path)
            let res = regItem2.exec(imp)
            if (res && res.length > 3) {
                let regTarget = res[2]
                content = this.loadOtherModule(imp, regTarget, path, content, level)
            }
        })

        //2.1 get imports 


        //3 load  as module
        return {
            content: content
        }
    }

    loadSystemModule(importStatement:string, target:string,content:string) {
        // fetch.ts
        logger.info("FileLoader load loadSystemModule")
        target =target.substring(0,target.length-1)
       return content.replace(importStatement,importStatement.replace(target,target.replace('@system','file:///' +Deno.cwd().replace(/\\/g,'/') +'/src/system') + '.ts'))
    }

    loadOtherModule(importStatement:string, target:string,currentFilePath:string, content:string, level:number = 0) {
        logger.info('FileLoader loadOtherModule level:', level)
        logger.info('FileLoader',importStatement, target )
        logger.info('FileLoader currentFilePath', currentFilePath)
        // 去除前后符号
        target = target.replace(/\'/g, '').replace(/\"/g,'').trim()
        //TODO 这样写不太好 逻辑不是很顺
        content = content.replace(target, target + '.js')
        let info:any = {
            currentFilePath,
            currentFileDirPath: this.getDirPathFromFilePath(currentFilePath)
        }

        info = {
            ...info,
            targetFilePath: target,
            targetFileDirPath: MIDDLE_JS_OUTPUT_PATH + info.currentFileDirPath + this.getDirPathFromFilePath(target),
            name: this.getNameFromFilePath(currentFilePath)
        }
        logger.info('FileLoader loadOtherModule info', info)

        // 1 make sure target file is exist 
        // 1.1 make sure target file parent dir is exist
        this.makeSureDir(info.targetFileDirPath) 
        // logger.info()
        let targetFileRealPath = SOURCE_ROOT_PATH + info.currentFileDirPath +  info.targetFilePath
        
        if (!targetFileRealPath.endsWith('.js') ) {
            targetFileRealPath += '.js'
        }
        logger.info('FileLoader loadOtherModule try to read targetFileRealPath: ', targetFileRealPath)
        let targetFileContent = this.decoder.decode(Deno.readFileSync(targetFileRealPath))
        // logger.info("FileLoader loadOtherModule content:\n\n" + targetFileContent,'\n\n')
        let res = this.loadContent(targetFileContent, targetFileRealPath, level)
        targetFileContent = res.content + ""
        // 1.2 load and write target file to out dir
        Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + info.currentFileDirPath +  info.targetFilePath + '.js',
        this.encoder.encode(targetFileContent))

        return content
    }

    getDirPathFromFilePath(filePath: string) {
        let tArr = filePath.split(/\/|(\\\\)/)
            .filter(i => i)         // 有可能包含undefined
        tArr.pop()
        tArr.push('')    
        return tArr.join('/')
    } 

    getNameFromFilePath(filePath:string) {
        let tArr = filePath.split(/\/|(\\\\)/)
        .filter(i => i)         // 有可能包含undefined
        return tArr.pop();
    }

    makeSureDir(path:string) {
        logger.info("FileLoader makeSureDir try ", path)
        Deno.mkdirSync(path, {recursive: true})
        logger.info("FileLoader makeSureDir", path)
    }
}