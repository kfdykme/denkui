
import logger from '@/log/console.ts'

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

export default {
    readFileSync,
    writeFileSync,
    mkdirSync
}