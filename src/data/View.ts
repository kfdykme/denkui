import Filters from '@/filter/Filters.ts'
import LoaderManager from '@/core/loader/LoaderManager.ts'
/**
 * 用于标记View的Css标签
 */
export class CssView {
    targetView: View
    cssTagsList: string[] = []

    constructor (target:View) {
        this.targetView = target
    }

    /**
     * 
     * @param tag 
     * @return {Boolean} tag是否已经存在
     */
    addTag(tag:string):boolean {
        if (this.hasTag(tag)) {
            this.cssTagsList.push(tag)
            return false;
        }
        return true;
    }

    hasTag(tag:string):boolean {
        return this.cssTagsList.indexOf(tag) === -1
    }
}

export class CssHelper {
    static class(view:View): string {
        try {
            if ( view?.jsonParams?.class != undefined) {
                return '.' + view?.jsonParams?.class
            } else {
                return ""
            }
        } catch (err) {
            return ""
        }
    }
 
    static LoadStyleByCssTag(tag:string):string {
        return LoaderManager.get().cssLoader.getCss(tag)
    }

    static buildStyle(view:View, superData:any) {
         
        // FIXME 这部分的逻辑还不完善
        const superClass = CssHelper.class(view)
        // console.info(superClass)
        let styleTagSuperClass = [superData.superClass, superClass].join(' ')
        if (superClass === "") {
            styleTagSuperClass = ""
        }
        const styleTagSuperAndName = [superData.superClass, view.name].join(' ')
        const styleTagSuperDirectName = [superData.superClass, '>' + view.name].join(' ')
        
        view.styleTags = [
            view.name,
            styleTagSuperClass,
            styleTagSuperDirectName,
            styleTagSuperAndName
        ]
        .filter(Filters.FilterNotEmptyText)
        .map((text:string) => {
            return text.trim()
        })
        .map((text:string) => {
            return CssHelper.LoadStyleByCssTag(text)
        })
        .filter(Filters.FilterNotUndefined)

        return styleTagSuperClass
    }
}

/**
 * className View
 * 记录用于在Flutter层进行渲染的数据结构
 */ 
export class View {

    name:string 
    content?:string = ''
    childs:View[]
    params:Map<string,string> 
    jsonParams:any = {}
    components?:View[] 
    superData:any = {}
    styleTags:string[] = []

    // 保存一下组件的src路径
    src:string = ""
    constructor(name:string) {
        this.name = name
        this.childs = []
        this.params = new Map()
        this.components = []
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
    build(superData:any = {}) {
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
       
        let styleTagSuperClass = CssHelper.buildStyle(this, superData)
        
        console.info('styleTags', this.styleTags)
        this.childs.forEach((child:View) => {
            child.build({
                superParams: this.params,
                superName: this.name,
                superClass: styleTagSuperClass    
            })
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
            // console.info("View eval ", key,value)
        }) 
        this.childs.forEach(child => {
            child.eval(context, false)
        })
    }

    
    format(level:number = 0) {
        return JSON.stringify(this,null,2)//.replace(/(\{|,|\}|("[a-z]+": (("")|(\[\])|(\{\})))|\[|\])/g,'').split(/(\r\n)|\r|\n/g).filter(i => i != "\n").join("\n")

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



