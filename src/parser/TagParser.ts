
const STATUS_WAIT_TAG_START = 1
const STATUS_TAG_START = 2
const STATUS_TAG_PARAM_START = 3
const STATUS_TAG_END = 4
const STATUS_CONTENT_START = 5
const STATUS_CONTENT_WAIT_END = 6

let tagStartReg = /\<(.*)/
let tagEndReg = /(\<\/(.*))/ 
let lineTagReg = /(\<(.+)?\/\>)|(\<(.+)?\>.*?\<\/(.*))/ 

export default class TagParser {

    stack:any[] = []
    cur:any[] = []
    constructor() {
    }

    in(fileContent:string) {
        let templateReg = /\<template\>(.|\r|\n|\r\n)*?\<\/template>/

        let result 
        result = fileContent.match(templateReg)
        if (result && result.length > 1) {
            let templateContent = result[0]
            return this.readTag(templateContent)
        }
        return 'no template element'
    }

    createNode(name:string):any[] {
        return  [
            name
        ]
    }

    pushNode(node:any) {
        // console.info('push', node)
        this.stack.push(node) 
        this.cur.push(node)
        this.cur = this.cur[this.cur.length-1]
    }

    popNode() {
        this.stack.pop()
        this.cur = this.stack[this.stack.length -1]
        // console.info('pop', this.cur)
    }

    addToCurrentNode(s:string) {
        this.cur[0] = `${this.cur[0]}\n${s}`
    }

    readTag(content:string):any { 
        let root:any[] = this.createNode('view')

        this.stack.push(root)
        this.cur = this.stack[this.stack.length-1]
 
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
        

        return root
    }
}