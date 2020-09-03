/*
 * @Author: kfdykme
 */

import logger from './log/console.ts'
const STORAGE_PATH = '~/.denkui/storage.json'
const docoder = new TextDecoder('utf-8')
const encoder = new TextEncoder()

/**
 * TODO: 后续考虑加入其他支持
 */

 let set = (o:any) => {
    let key:string = o.key
    let value:string = o.value
    Deno.mkdirSync('~/.denkui/', { recursive: true})

    let content = '{}'
   
    let json = JSON.parse(content)
    json[key] = value
    content = JSON.stringify(json)
    Deno.writeFileSync(STORAGE_PATH, encoder.encode(content))
}

let getJson =  (o:any):any => {
    let key:string = o.key 
    let content = '{}'
    try {
        content = docoder.decode(Deno.readFileSync(STORAGE_PATH));
    } catch(e) {
        logger.info('STORAGE set', 'new sotrage init')
        
    }
    
    let json = JSON.parse(content)
    return json
}

let get = (o:any) => {
    let key:string = o.key 
    let json = getJson(o)
    return new Promise((reslove, rejcet) => {
        let res = {
            data:json[key]
        }
        logger.info("SYSTEM.STORAGE get ", o, " result is :", res)
        reslove(res)
    })
}

export default {
    set,
    get 
}