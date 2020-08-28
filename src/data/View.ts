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
        return JSON.stringify(this, null, 2)
    }

    /**
     * 处理name , param 等内容
     */
    build() {
        let nameReg = /\<([a-z]+)?( |\n|\>)/
        let res:any = nameReg.exec(this.name)
        let template = this.name
        this.name = res ? res[1] : ''
        this.content = template.substring(this.name.length+2) 

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
        res = this.content.match(contentReg)
        this.content = res ? res[1] : '' 
        this.childs.forEach((child:View) => {
            child.build()
        })

    }
}



