import {CodeData} from './CodeData'
import {TagData} from './Tag'
import {ImportLoader } from './ImportLoader'
const fs = require('fs')
const regScript = /\<script\>(.*(\r\n|\r|\n))?((.*(\r\n|\r|\n))*)\<\/script\>/ 
const regStyle =  /\<style.*?\>(.*(\r\n|\r|\n))?((.*(\r\n|\r|\n))*)\<\/style\>/
const regTemplate =  /\<template.*?\>(.*(\r\n|\r|\n))?((.*(\r\n|\r|\n))*)\<\/template\>/
const EMPTY_FILE = "//empty file"


/**
 * 
 */
export class FileReader {
    // decoder:TextDecoder
    constructor() {
        // this.decoder =  new TextDecoder("utf-8");
    }

    readJsonFileSync = (filePath:string):any => {
        return JSON.parse(fs.readFileSync(filePath) + '')
    }

    readFile = (path:string):string => {
        return  fs.readFileSync(path) + ''
    }

    readTag = (content:string, tag:string, path:string):TagData => {
        let reg = new RegExp("\<" + tag + "(.*?)\>(.*(\r\n|\r|\n))?((.*(\r\n|\r|\n))*)\<\/" + tag + "\>")
        let result = reg.exec(content)
        let o:any = {
            params:{

            },
            content: '',
            
        }
        if (result && o) {
            let res = result.filter(i=> {
                return i && i.trim() != ''
            }) 

            if (res.length >= 2) {
                o.content = res[2] ? res[2] : ''
                res[1].split(/( |\r\n|\r|\n)+/g).filter(i => i.trim() != '').forEach((i:string) => {
                    let t:string[] =i.split("=") 
                    o.params[t[0]]= t[1]? t[1].substring(1, t[1].length-1) : ''
                })
            }
        }
        
        
        return new TagData(o.params, o.content,path)
    }

    readFileSync = (filePath:string):CodeData => {
        let res:any = {}
        let conetnt = this.readFile(filePath);
        res.script = this.readTag(conetnt,'script',filePath)  
        try {
            res.script.content = this.readFile(res.script.path + res.script.params.src)
            let importReg = /import (.*) from (.*);?(\r\n|\r|\n)/g
            res.script.imports = res.script.content.match(importReg).map((importItem: string) => {
                new ImportLoader(importItem, res.script.path)
                return importItem
            }) 
            let arr = ['router','fetch','storage','prompt']
            arr.forEach((i:string) => {

                // res.script.content = res.script.content
                // .replace('@system.'+i,'file:///C:/Users/kfmechen/Desktop/wor/bbs-quick/denkui/dist/system.' + i )
            })
        
        } catch(e) {

        }
        // res.style = this.readTag(conetnt,'style')
        // res.template = this.readTag(conetnt,'template')
        return res
    }

    readTemplateFromFileSync = (filePath:string):string => {
        let result = regStyle.exec(
            fs.readFileSync(filePath) + ''
        )
        return result && result.length>3 ? 
        result[3]:
        EMPTY_FILE
    }

    readStyleFromFileSync = (filePath:string):string => {
        let result = regStyle.exec(
            fs.readFileSync(filePath) + ''
        )
        return result && result.length>3 ? 
        result[3]:
        EMPTY_FILE
    }

    readJsCodeFromFileSync = (filePath:string) => { 
        let data = fs.readFileSync(filePath) + ''
        // let content = this.decoder.decode(data)
        let result = regScript.exec(data)
        let scriptContent:string  =result && result.length > 3 ? result[3] : EMPTY_FILE
        return scriptContent     
    }
}