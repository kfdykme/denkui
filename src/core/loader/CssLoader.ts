import LoaderManager from '@/core/loader/LoaderManager.ts'
import LoadTagResult from '@/data/LoadTagResult.ts'
import Logger from '@/log/logger.ts'

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

    private cssSize() {
        return this.globalCssMap.values.length
    }
}  
