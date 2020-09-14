export class View {

    name:string 
    content:string = ''
    childs:View[]
    params:Map<string,string> 
    jsonParams:any = {}
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
        let nameReg = /\<([a-z]+)?( |\n|\>)/
        let res:any = nameReg.exec(this.name)
        let template = this.name
        this.name = res ? res[1] : ''
        this.content = template.substring(this.name.length) 

        // 如果是单行的view
        let paramReg = /[a-z]+=\".*?\"/g
        let contentReg = /\>(.*)?\<\// 
        this.content.match(paramReg)?.forEach((keyValue:string) => {
            let [key, value] = keyValue.split('=') 
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

    replace(key:string, value:any) {
        if (this.content) {
            console.info(`View replace {{${key}}} into ${value} at ${this.content.indexOf(key)}`)
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



