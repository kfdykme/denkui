
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

    readTag(content:string):any {
        let pos = -1
        let status = STATUS_WAIT_TAG_START

        let tagStartPos = -1
        let tagEndPos = -1
        let tag = ''

        let contentStartPos = 0
        let tagContent = ''
        let c 
        while(++pos + (tag.length + 3)< content.length) {
            c = content.charAt(pos)
            if (c === '<' && 
            status === STATUS_WAIT_TAG_START) {
                status = STATUS_TAG_START
                tagStartPos = pos
            }

            if (status === STATUS_TAG_START ||
                status === STATUS_TAG_PARAM_START) {
                if (c === ' ') {
                    status = STATUS_TAG_PARAM_START
                }

                if (c === '>') {
                    status = STATUS_TAG_END
                }
            }

            if (status === STATUS_TAG_END) {
                status = STATUS_CONTENT_START
                tagEndPos = pos
                tag = content.substring(tagStartPos+1, tagEndPos)
            }

            if (status === STATUS_CONTENT_START) {
                contentStartPos = pos
                status = STATUS_CONTENT_WAIT_END
            }
        }

        tagContent = content.substring(contentStartPos +1, pos)
        let childs:any[] = []
        console.info(status)
        if (status !== STATUS_WAIT_TAG_START) {
            // childs = this.readTag(content)
        }
        return {
            name: tag,
            content: tagContent,
            childs
        }
    }
}