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
                return view?.jsonParams?.class.split(' ')
                .filter(Filters.FilterNotEmptyText)
                .map((singleClass:string) => '.' + singleClass).join(' ')
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

    // static buildStyle(view:View, superData:any) {
        
        

    //     const CLASS_SPLIT = ' '
         
    //     // FIXME 这部分的逻辑还不完善
    //     const classes = CssHelper.class(view)
    //         .replace(/\{\{.*?\}\}/, '')
    //         .trim()
    //         .split(CLASS_SPLIT)
    //         .filter(Filters.FilterNotEmptyText)
    //         .filter((sup:string) => {
    //             return sup !== '.' 
    //         } )
    //     superData.superClass = superData.superClass == undefined ? [] : superData.superClass  
    //     let superClasses:string[] = []
    //     if (typeof superData.superClass === 'string') {
    //         superData.superClass = [superData.superClass ]
    //     }
    //     classes.forEach((superClass:string) => {
    //         superClasses = superClasses.concat(superData.superClass
    //             .filter((sup:string) => {
    //                 return sup !== '.' 
    //             } )
    //             .map((sup: string) => {
    //             return [sup.trim(), superClass].join(CLASS_SPLIT)
    //         }))
    //     })
    //     if (classes.length === 0) {
    //         superClasses = superData.superClass
    //     }

    //     if (superClasses.length == 0) {
    //         superClasses = classes
    //     }

    //     const styleTagSuperAndName = [superData.superClass, view.name].join(CLASS_SPLIT)
    //     const styleTagSuperDirectName = [superData.superClass, '>' + view.name].join(CLASS_SPLIT)
        
    //     view.styleTags = [
    //         view.name,
    //         // '----------',
    //         ...classes,
    //         // '----------',
    //         ...superClasses,
    //         // '----------',
    //         styleTagSuperDirectName,
    //         styleTagSuperAndName,
    //         JSON.stringify({
    //             parent: superData.superClass,
    //             current: classes
    //         }, null, 2)
    //     ]
    //     .filter(Filters.FilterNotEmptyText)
    //     .map((text:string) => {
    //         return text.trim()
    //     })
    //     .map((text:string) => {
    //         return CssHelper.LoadStyleByCssTag(text)
    //     })
    //     .filter(Filters.FilterNotUndefined)
    //     .sort((styleA:any, styleB:any) => { 
    //         return styleA.index - styleB.index
    //     })

    //     return superClasses
    // }

    static mapCss(view: View) {
        if (view.styleTags.length > 0 && typeof view.styleTags[0] !== 'string') {
            console.info('CssHelper mapCss again', view.name, view.styleTags)
            return
        }
        view.styleTags = view.styleTags
            .map((text:string) => {
                return CssHelper.LoadStyleByCssTag(text)
            })
            .filter(Filters.FilterNotUndefined)
            .sort((styleA:any, styleB:any) => { 
                return styleA.index - styleB.index
            })

        console.info('CssHelper mapCss', view.name, view.styleTags)
    }
}

/**
 * className View
 * 记录用于在Flutter层进行渲染的数据结构
 */ 
export class View {

    name:string 
    // 保存原始数据
    content?:string = ''
    // 保存替换后的数据
    renderContent?:string = ''
    childs:View[]
    params:Map<string,string> 
    jsonParams:any = {}
    components?:View[] 
    superData:any = {}
    styleTags:string[] = []

    // 保存一下组件的src路径
    src:string = ""


    hasBuildViewName = false
    hasLoadCss = false


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


    buildNameAndContent() {
        if (!this.hasBuildViewName) {
            this.hasBuildViewName = true

            let nameReg = /\<(([a-z]|-)+)?( |\n|\>)/
            let res:any = nameReg.exec(this.name)
            let template = this.name
            this.name = res ? res[1] : ''
            this.renderContent = template.substring(this.name.length+1).trim()            

            // 如果是单行的view
            let paramReg = /([a-z]|-|@|)+=\"(.| )*?\"/g
            let contentReg = /\>(.*)?\<\// 
            
            this.renderContent?.match(paramReg)?.forEach((keyValue:string) => {
                let spIndex:number = keyValue.indexOf('=')
                let key = keyValue.substring(0, spIndex)
                let value = keyValue.substring(spIndex+1) 
                this.params.set(key, value.replace(/\"/g,''))
            })
            
            this.params.forEach((value, key) => {
                this.jsonParams[key] = value
            }) 
            
            // console.info( this.content,this.content.match(contentReg))
            res = this.renderContent.match(contentReg)
            this.renderContent = res ? res[1] : '' 
        }
    }


    /**
     * 处理name , param 等内容
     */
    build(superData:any = {}) {
        this.buildNameAndContent()
       
        // let superClasses = CssHelper.buildStyle(this, superData)
        LoaderManager.get().cssLoader.buildCssTagsFromView(this)
        // console.info('styleTags', this.styleTags)
        this.childs.forEach((child:View) => {
            child.build({
                superParams: this.params,
                superName: this.name,
                superClass: 'superClasses'    
            })
        })

        // 一开始的时候,这两者是相同的
        this.content = this.renderContent
    }
 

    deleteNull() {
        if (this.renderContent == "") delete(this.renderContent)
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
                
                const res2 = eval(str).call(context)
                //console.info('View eval ', str, ' result', res2)
                return res2
            } catch(err) {
                console.error(err)
                return str
            }
          
        }
        //console.info('View innerEval ', str, res)
        res?.forEach((i:string) => {
            let tryEvalRes = tryEval(i)
            //console.info('View innerEval replace ', str, ' from ', i, ' into ', tryEvalRes)
            str = str.replace(i, tryEvalRes)
        })
        
        return str
        
    }

    eval(context:any, showContext:Boolean = true) {
        if (showContext )
            //console.info('View eval context:', context)
        if (this.content !== undefined) {
            this.renderContent = this.innerEval(this.content, context)
            
            //console.info('View innerEval content ', this.name, this.content, ' ==> ', this)
        }
        this.params.forEach((value, key) => {
            //console.info('View innerEval ', key, value)
            value = this.innerEval(value, context)
            this.jsonParams[key] = value
            // console.info("View eval ", key,value)
        }) 
        this.childs.forEach(child => {
            child.eval(context, false)
            //console.info(this.toString())
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
            if (this.content.indexOf(key) != -1) {
                //console.info(`View replace {{${key}}} into ${value} at ${this.content.indexOf(key)} \n`)
                this.renderContent = this.content.replace(`{{${key}}}`, value)
            }
        }
        if (this.jsonParams) {
            this.jsonParams = JSON.parse(JSON.stringify(this.jsonParams).replace(`{{${key}}}`, value))
        }
        
        this.childs.forEach((child:View) => {
            child.replace(key, value)
        })
    }
}



