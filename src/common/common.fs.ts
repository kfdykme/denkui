
import logger from '@/log/console.ts'
import path from '@/common/common.path.ts'

const decoder = new TextDecoder('utf-8') 
const encoder = new TextEncoder()
const readFileSync = (filePath:string) => {
    return decoder.decode(Deno.readFileSync(filePath))
}  
 
const writeFileSync = (filePath:string, content:string) => {
    return Deno.writeFileSync(filePath, encoder.encode(content))
}

const mkdirSync = (path:string, option: any) => {
    return Deno.mkdirSync(path, option)
}

interface IReadDirRes {
    name:string
    path: string
    isFile: boolean,
    isDirectory: boolean,
    isSymlibk: boolean
}

const readDirSync = (filePath: string):IReadDirRes[] => {
    let res:any[] = []
    for( const item of Deno.readDirSync(filePath)) {
        const dirItem = {
            path: filePath + path.Dir.Spelator + item.name,
            ...item
        }
        res.push(dirItem)
    }
    return res
}

const walkDirSync = (filePath: string):IReadDirRes[] => {
    let res:any[] = []
    for(const item of readDirSync(filePath)) {
        if (item.isDirectory) {
            res = res.concat(walkDirSync(item.path))
        } else if (item.isFile || item.isSymlibk) {
            res.push(item)
        }
    }
    return res
}


const statSync = (filePath: string) => {
    try {
        const fileid = Deno.openSync(filePath, { read: true })
        return {
            isExist: true,
            ... Deno.fstatSync(fileid.rid)
        }
    } catch (err) {
        return {
            isExist: false
        }
    }
}
export default {
    readFileSync,
    writeFileSync,
    mkdirSync,
    readDirSync,
    walkDirSync,
    statSync
}