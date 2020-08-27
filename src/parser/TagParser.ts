
const STATUS_WAIT_TAG_START = 1
const STATUS_TAG_START = 2
const STATUS_TAG_PARAM_START = 3
const STATUS_TAG_END = 4
const STATUS_CONTENT_START = 5
const STATUS_CONTENT_WAIT_END = 6

export default class TagParser {

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

    createNode(name:string):any {
        return  [
            name
        ]
    }

    readTag(content:string):any {
        let stack:any[] = [] 
        let tagStartReg = /\<(.*)/
        let tagEndReg = /\<\/(.*)/
        let lineTagReg = /\<(.*)?\>.*?\<\/.*?\>/

        let root:any[] = [
            'root'
        ]

        stack.push(root)
        let cur:any[] =stack[stack.length-1]

        let lineArray = content.split(/(\r|\n|\r\n)/g)
        .map(i => {
            return i.replace(/\<\!--.*?--\>/,'').trim()
        })
        .filter(i => {
            return i !== '' && i !== '\n'
        })
        .forEach(i => {
            if (lineTagReg.test(i)) {
                console.info('line', i)
                
            } else if (tagEndReg.test(i)) {
                console.info('pop', i)
                cur = stack.pop()

            } else if (tagStartReg.test(i)) {
                console.info('push', i)
                let n = this.createNode(i)
                stack.push(n)
                cur.push(n)
                cur = cur[cur.length-1]
            }   
        })
        

        return root
    }
}