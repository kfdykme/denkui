/*
 * @Author: kfdykme
 */

import TagData from '../data/TagData.ts'

let readTag = (tag:string, path:string,content:string = ''):TagData => {
    console.info('TAGREADER readTag', tag, path, content)
    if (content === '') {
        let decoder = new TextDecoder('utf-8')
        content = decoder.decode(Deno.readFileSync(path))
    }
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


export  {
    readTag
}