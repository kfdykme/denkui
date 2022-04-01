/*
 * @Author: kfdykme
 */

import logger from '@/log/console.ts'
import fs from '@/common/common.fs.ts'
import path from './common/common.path.ts'

interface IGetP {
    key: string
}

interface ISetP extends IGetP {
    value: any
}

const STORAGE_PATH = path.homePath() + '/.denkui/storage.json'
/**
 * TODO: 后续考虑加入其他支持
 */

 let set = async (o:ISetP) => {
    let key:string = o.key
    let value:string = o.value
    fs.mkdirSync(path.homePath() + '/.denkui', { recursive: true})

    let json = getJson(o)
    json[key] = value
    let content = JSON.stringify(json) 
    fs.writeFileSync(STORAGE_PATH, content)
}

let getJson =  (o:IGetP):any => {
    let key:string = o.key 
    let content = '{}'
    try {
        content = fs.readFileSync(STORAGE_PATH);
    } catch(e) {
        logger.info('SYSTEM.STORAGE set', 'new sotrage init')
        
    }
    
    let json = JSON.parse(content)
    return json
}

let get = (o:IGetP):Promise<any> => {
    let key:string = o.key 
    let json = getJson(o)
    return new Promise<any>((reslove, rejcet) => {
        let res = {
            data:json[key]
        }
        // logger.info("SYSTEM.STORAGE get ", o, " result is :", res)
        reslove(res)
    })
}

export default {
    set,
    get 
}