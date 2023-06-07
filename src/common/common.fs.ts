
import logger from '@/log/console.ts'
import path from '@/common/common.path.ts'

const decoder = new TextDecoder('utf-8') 
const encoder = new TextEncoder()
const readFileSync = (filePath:string):string => {
    return decoder.decode(Deno.readFileSync(filePath))
}  
 
const writeFileSync = (filePath:string, content:string) => {
    if (!statSync(filePath, true, true).isExist) {
        throw Error("writeFileSyncFail")
    }
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
    // const { isExist } = statSync(filePath)
    // if (!isExist) {
    //     throw new Error(`walkDirSync error file: ${filePath} is not exist`)
    // }
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


const statSync = (filePath: string, read: boolean = true, write: boolean = false): any => {
    try {
        const fileid = Deno.openSync(filePath, { read: read, write: write })
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
const isEmptyFile = (filePath: string) => {
    const s = statSync(filePath);
    if (!s.isExist) {
        return true
    }

    if (s.isFile) {
        return readFileSync(filePath).trim() === ""
    }

    return true
}

const unlinkFile = (filePath: string) => {
    return Deno.removeSync(filePath);
}

export default {
    readFileSync,
    writeFileSync,
    mkdirSync,
    readDirSync,
    walkDirSync,
    statSync,
    isEmptyFile,
    unlinkFile
}