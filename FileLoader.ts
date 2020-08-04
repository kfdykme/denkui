const MIDDLE_JS_OUTPUT_PATH = './intermediate/js/'
const SOURCE_ROOT_PATH = '../src/'

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

    load(path:string) {
        console.info('FileLoader load', path)
        //0 find target file from source dir
        let loadPath = SOURCE_ROOT_PATH + path 
        
        console.info('FileLoader laod', 'try load file:' + loadPath)
        //1 load file content
        let content = new TextDecoder('utf-8').decode(Deno.readFileSync(loadPath))
        //2,3 in loadContent function
        let res = this.loadContent(content, path)
    
        console.info('FileLoader load', 'try write to ' + path)
        
        
        Deno.mkdirSync(MIDDLE_JS_OUTPUT_PATH + this.getDirPathFromFilePath(path), { recursive: true})
        Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + path ,
            this.encoder.encode(res.content))
        return {
            content: res.content,
            path:MIDDLE_JS_OUTPUT_PATH + path
        }
    }

    loadContent(content: string, path:string) {
        //2 load imports 
        const regImport =  /import +.*? from +(.*);?/g
        let improts = content.match(regImport)
        improts?.forEach((imp:string) => {
            const regItem = /import +.*? from +(.*);?/
            let res = regItem.exec(imp)
            console.info('FileLoader load mport:[' + imp+ ']')//,regImport, res)
            if (res &&res?.length > 1) {
                let regTarget = res[1] 
                if (regTarget.startsWith('\'@system')
                || regTarget.startsWith('"@system')) {
                   content = this.loadSystemModule(imp, regTarget, content)
                } else if (regTarget.includes("https")) {
                    // do nothing
                } else if (regTarget.includes('/')){
                   content = this.loadOtherModule(imp, regTarget, path,content)
                }
            } else {
                
             console.info(res, res?.length)
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
        console.info("FileLoader load loadSystemModule")
        target =target.substring(0,target.length-1)
       return content.replace(importStatement,importStatement.replace(target,target.replace('@system','file:///C:/Users/wimkf/wor/bbs-quick/denkui/src/system') + '.ts'))
    }

    loadOtherModule(importStatement:string, target:string,currentFilePath:string, content:string) {
        console.info('FileLoader loadOtherModule')
        console.info(importStatement, target, currentFilePath)
        // 去除前后符号
        target = target.replace(/\'/g, '').replace(/\"/g,'')
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
        console.info('FileLoader loadOtherModule info', info)

        // 1 make sure target file is exist 
        // 1.1 make sure target file parent dir is exist
        this.makeSureDir(info.targetFileDirPath) 
        // console.info()
        let targetFileRealPath = SOURCE_ROOT_PATH + info.currentFileDirPath +  info.targetFilePath + '.js'
        let targetFileContent = this.decoder.decode(Deno.readFileSync(targetFileRealPath))
        // console.info("FileLoader loadOtherModule content:\n\n" + targetFileContent,'\n\n')
        let res = this.loadContent(targetFileContent, targetFileRealPath)
        targetFileContent = res.content + ""
        // 1.2 load and write target file to out dir
        Deno.writeFileSync(MIDDLE_JS_OUTPUT_PATH + info.currentFileDirPath +  info.targetFilePath + '.js',
        this.encoder.encode(targetFileContent))

        // 

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
        console.info("FileLoader makeSureDir try ", path)
        Deno.mkdirSync(path, {recursive: true})
        console.info("FileLoader makeSureDir", path)
    }
}