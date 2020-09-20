export class View {

    name:string 
    content?:string = ''
    childs:View[]
    params:Map<string,string> 
    jsonParams:any = {}
    components?:any[]
    constructor(name:string) {
        this.name = name
        this.childs = []
        this.params = new Map()
    }

    addContent (content:string) {
        this.name = `${this.name}\n${content}`
    }

    toString() {
        return JSON.stringify(this)
    }


    /**
     * 处理name , param 等内容
     */
    build() {
        let nameReg = /\<(([a-z]|-)+)?( |\n|\>)/
        let res:any = nameReg.exec(this.name)
        let template = this.name
        this.name = res ? res[1] : ''
        this.content = template.substring(this.name.length+1).trim()

        // 如果是单行的view
        let paramReg = /([a-z]|-|@|)+=\"(.| )*?\"/g
        let contentReg = /\>(.*)?\<\// 
         
        this.content.match(paramReg)?.forEach((keyValue:string) => {
            let spIndex:number = keyValue.indexOf('=')
            let key = keyValue.substring(0, spIndex)
            let value = keyValue.substring(spIndex+1) 
            this.params.set(key, value.replace(/\"/g,''))
        })
        
        this.params.forEach((value, key) => {
            this.jsonParams[key] = value
        }) 
        
        // console.info( this.content,this.content.match(contentReg))
        res = this.content.match(contentReg)
        this.content = res ? res[1] : '' 
        this.childs.forEach((child:View) => {
            child.build()
        })
    }

    deleteNull() {
        if (this.content == "") delete(this.content)
        // if (this.jsonParams.values.length == 0) {
        //     delete(this.params)
        //     delete(this.jsonParams)
        // }
        this.childs.forEach(child => {
            child.deleteNull()
        })
    }

    innerEval (str:string, context:any)  {
        let targetStrReg = /\{\{.*?\}\}/g
        let res:string[]|null = targetStrReg.exec(str) 
        let tryEval = (str:string) => {
            try {
                str = str.replace('{{', '').replace('}}','')
                const reg = /([a-z]|[A-Z])(([a-z]|[A-Z]|[0-9])*)/
                str = "(function() {  return " + 
                str.split(' ')
                .filter((f:string) => {
                    return f.trim() != ''
                })
                .map(i => {
                    if (reg.test(i) && i.indexOf('\'') == -1) {
                        i = 'this.' + i
                    }
                    return i
                }).join(' ') + 
                "})" 
                
                return eval(str).call(context)
            } catch(err) {
                console.error(err)
                return str
            }
          
        }
        res?.forEach((i:string) => {
            str = str.replace(i, tryEval(i))
        })
        
        return str
        
    }

    eval(context:any, showContext:Boolean = true) {
        if (showContext)
            console.info('View eval context:', context)
        this.params.forEach((value, key) => {
            value = this.innerEval(value, context)
            this.jsonParams[key] = value
            console.info("View eval ", key,value)
        }) 
        this.childs.forEach(child => {
            child.eval(context, false)
        })
    }

    
    format(level:number = 0) {
        let arr = new Array(level).fill(' ')
        let res = this.name
        this.childs.forEach(child => {
            res +=  '\n' + arr.join('')  + ' -> ' + child.format(level+1)
        })
        return res
    }

    replace(key:string, value:any) {
        if (this.content) {
            if (this.content.indexOf(key) != -1)
                console.info(`View replace {{${key}}} into ${value} at ${this.content.indexOf(key)} \n`)
            this.content = this.content.replace(`{{${key}}}`, value)
        }
        if (this.jsonParams) {
            this.jsonParams = JSON.parse(JSON.stringify(this.jsonParams).replace(`{{${key}}}`, value))
        }
        
        this.childs.forEach((child:View) => {
            child.replace(key, value)
        })
    }
}



