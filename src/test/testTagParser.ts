import TagParser from '@/parser/TagParser.ts' 

let parser = new TagParser()
 
console.info(Deno.cwd())

let textDecoder = new TextDecoder('utf-8')

let templateFilePath = './src/test/res/Main.ux'
let testFilePath = [
    templateFilePath,
    // './res/Login.ux'
]


testFilePath.map(i => {
    let res = parser.in(textDecoder.decode(Deno.readFileSync(i)))
    
    return res
}).map((v) => {
    v.deleteNull()
    return v
}).forEach(v => {
    console.info(v.format())
})