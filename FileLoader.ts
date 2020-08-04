
let sInstance:FileLoader|null = null
export class FileLoader {
    constructor() {

    }

    static getInstance() {
        if (sInstance === null) {
            sInstance = new FileLoader()
        }
        return sInstance
    }

    load(path:string) {
        //1 load file content
        let content = new TextDecoder('utf-8').decode(Deno.readFileSync(path))
        //2 load imports

        let regImport =  /import .* from +(.*);?(\r\n|\r|\n)/g 
        let improts = content.match(regImport)
        improts && improts.forEach((imp:string) => {
            let res = regImport.exec(imp)
            if (res && res.length > 2) {
                let regTarget = res[1] 
                if (regTarget.startsWith('\'@system')
                || regTarget.startsWith('"@system')) {
                   content = this.loadSystemModule(imp, regTarget, content)
                } else {

                }
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
        target =target.substring(0,target.length-1)
       return content.replace(importStatement,importStatement.replace(target,target.replace('@system','file:///C:/Users/kfmechen/Desktop/wor/bbs-quick/denkui/src/system') + '.ts\''))
    }
}