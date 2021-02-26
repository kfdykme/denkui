import LoaderManager from '@/core/loader/LoaderManager.ts'
import LoadTagResult from '@/data/LoadTagResult.ts'
import Logger from '@/log/logger.ts'

// import  from '@/data/View.ts'
import { View, CssHelper } from '@/data/View.ts'
import Filters from '@/filter/Filters.ts'
/**
 * CssLoader 传入CSS的文本， 给出结构
 */
const logger = new Logger('CssLoader')

// A Stack with top function
class BaseStack {
    data:any[] = []

    push(el:any) {
        this.data.push(el)
    }

    pop() {
        return this.data.pop()
    }

    top() {
        return this.data[this.data.length -1]
    }

    isEmpty() {
        return this.data.length == 0
    }

    size() {
        return this.data.length
    }
}

export default class CssLoader {

    name:string = "CssLoader"

    globalCssMap:Map<string,any> = new Map

    static get() {
        return LoaderManager.get().cssLoader
    }

    

    public loadTag(tag: LoadTagResult) {
        logger.dev('loadTag', tag)
        let cssStack = new BaseStack()
        let cssRes:any[] = []
        const isCssStart = (text:string) => {
            return text.indexOf('{') !== -1
        }
        const isCssEnd = (text:string) => {
            return text.indexOf('}') !== -1
        }
        const getHeaderFromLine = (text:string) => {
            return text.replace('{','')
        }
        const loadCssLines = (line:string) => {
            let cssItem:any = undefined
            line = line.trim()
            if (isCssStart(line)) {
                let preHeader = ''
                if (!cssStack.isEmpty()) {
                    preHeader = cssStack.top().header
                }
                cssItem = {
                    header: [preHeader,getHeaderFromLine(line)].join(' ').trim().replace(/\> +/g,'>'),
                    index: this.cssSize() + cssRes.length,
                    body:[]
                }
                cssStack.push(cssItem)
            } else if (isCssEnd(line)) {
                cssItem = cssStack.top()
                cssItem.isClose = true
                cssStack.pop()
                cssRes.push(cssItem)
                
            } else {
                // normal css body 
                cssItem = cssStack.top()
                cssItem?.body.push(line)
            }
        }
        const filterStringNotEmpty = (text:string) => {
            return text.trim().length > 0
        }
        const cssLines = tag.content
                            .split('\n')
                            .filter(filterStringNotEmpty)
                            .forEach(loadCssLines)
        logger.dev('res', cssRes)

        this.addCss(cssRes)
    }

    private addCss(cssList: any[]) {
        cssList.forEach((item:any) => {
            this.globalCssMap.set(item.header, item)
        })
    }

    public getCss(tag:string) {
        return this.globalCssMap.get(tag)
    }

    public buildCssTagsFromView(view: View) {
        let viewStack = this.changeViewTreeIntoViewStack(view)


        viewStack.forEach((view:View) => {  
            view.buildNameAndContent()
        })
        viewStack = viewStack.filter((v: View) => {
            return v.name !== 'view' && v.name !== 'template'
        }) 
        viewStack.forEach((v: View) => {
            if (v.hasLoadCss) {
                return
            }
            v.hasLoadCss = true          
            console.info('CssLoader buildCssTagsFromView ', v.name, v.styleTags) 
            this.buildSingleCssNode(v)
        })

        viewStack.forEach((v: View) => {
            CssHelper.mapCss(v)
        })
    }

    private buildSingleCssNode(view: View, parentCss: string[] = []) {
        view.styleTags.push(view.name)
        const classes = CssHelper.class(view)
        view.styleTags = view.styleTags.concat(classes)
                            .filter(Filters.FilterNotEmptyText)
        
        let withParents: string[] = []
        if (parentCss.length >= 1) {
            parentCss.forEach((parent: string) => {
                view.styleTags.forEach((css: string) => {
                    withParents.push([parent, css].join(' '))
                })
            })
    
            view.styleTags = withParents
        }
  
        console.info('CssLoader buildSingleCssNode \n name: ', view.name, '\n class: ', classes, '\n css: ', view.styleTags)
        view.childs.forEach((child:View) => {
            this.buildSingleCssNode(child, view.styleTags)
        })
    }

    private changeViewTreeIntoViewStack(view: View) {
        let viewStack = [view]
        let viewCacheStack = [view]

        view = viewCacheStack.pop()!!
        while(view != null) {
            view.childs.forEach((child: View) => {
                viewCacheStack.push(child)
                viewStack.push(child)
            })
            view = viewCacheStack.pop()!!
        }
        return viewStack
    }

    private innerBuildCss(view: View) {

    }

    private cssSize() {
        return this.globalCssMap.values.length
    }
}  
