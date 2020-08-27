import TagParser from '../parser/TagParser.ts'
console.info(TagParser)

let parser = new TagParser()
 

let textDecoder = new TextDecoder('utf-8')

let templateFilePath = './res/index.ux'


let res = parser.in(textDecoder.decode(Deno.readFileSync(templateFilePath)))

console.info(res )