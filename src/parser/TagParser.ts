import { FileLoader } from "../core/FileLoader.ts"
import { View } from "../data/View.ts" 
import logger from '../log/console.ts'
const STATUS_WAIT_TAG_START = 1
const STATUS_TAG_START = 2
const STATUS_TAG_PARAM_START = 3
const STATUS_TAG_END = 4
const STATUS_CONTENT_START = 5
const STATUS_CONTENT_WAIT_END = 6

let tagStartReg = /\<(.*)/
let tagEndReg = /(\<\/(.*))/ 
let lineTagReg = /(\<(.+)?\/\>)|(\<(.+)?\>.*?\<\/(.*))/ 

let textDecoder = new TextDecoder('utf-8');

let sInstance:TagParser|null = null
export default class TagParser {

    stack:View[] = []
    cur:View
    constructor() {
        this.cur = this.createNode('<view>')
    }


    static getInstance():TagParser {
        if (sInstance === null) {
            sInstance = new TagParser()
        }

        return sInstance;
    }

    path(path:string):View {
        return this.in(
            textDecoder.decode(Deno.readFileSync(path)), path)
    }

    in(fileContent:string, filePath:string):View {
        let templateReg = /\<template\>(.|\r|\n|\r\n)*?\<\/template>/
        let view = new View("no template element")
        let result 
        result = fileContent.match(templateReg)
        if (result && result.length > 1) {
            let templateContent = result[0]
            view =  this.readTag(templateContent)
        }
        
        let importReg = /<import +name="(.*?)" +src="(.*?)"><\/import>/g
        let importViews =fileContent.match(importReg)
        
        view.components = importViews?.map((i:string) => {
            let [content, name, src] = /<import +name="(.*?)" +src="(.*?)"/.exec(i)?? [i,i,i]
            return {
                name,
                src: FileLoader.getDirPathFromFilePath(filePath) + src + '.ux'
            }
        }).map((o:any) => {
            let module:View = this.path(o.src)
            console.info(module.toString())
            module.name = o.name
            module.src = o.src
            return module
        })
        console.info("TagPerseDebug",  view.components)
        return view
    }

    createNode(name:string):View {
        return  new View(name)
    }

    pushNode(node:any) {
        logger.info('TagParser push', node) 
        this.stack.push(node) 
        this.cur.childs.push(node)
        this.cur = this.cur.childs[this.cur.childs.length - 1]
    }

    popNode() {
        this.stack.pop()
        this.cur = this.stack[this.stack.length -1]
        logger.info('TagParser pop, current is : ', this.cur)
    }

    addToCurrentNode(s:string) { 
        this.cur.addContent(s)
    }

    readTag(content:string):View {  
        this.cur = this.createNode('<view>')
        this.stack = [this.cur]

 
        content.split(/(\r|\n|\r\n)/g).map(i => { 
            return i.replace(/\<\!--.*?--\>/,'').trim()
        })
        .filter(i => {
            return i !== '' && i !== '\n'
        })
        .forEach(i => {
            if (lineTagReg.test(i)) {
                // console.info('line', i)
                let n = this.createNode(i)
                this.pushNode(n)
                this.popNode()
            } else if (tagEndReg.test(i)) {
                this.popNode()
            } else if (tagStartReg.test(i)) {
                let n = this.createNode(i)
                this.pushNode(n)
            } else {
                this.addToCurrentNode(i)
                if (/\/\>/.test(i)) {
                    this.popNode()
                }
            }
        })
        
        this.cur.build()
        return this.cur
    }
}