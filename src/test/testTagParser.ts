import TagParser from '../parser/TagParser.ts' 

let parser = new TagParser()
 

let textDecoder = new TextDecoder('utf-8')

let templateFilePath = './res/Slash.ux'
let testFilePath = [
    // templateFilePath,
    './res/Login.ux'
]


testFilePath.forEach(i => {
    let res = parser.in(textDecoder.decode(Deno.readFileSync(i)))
    
    console.info(res)
})