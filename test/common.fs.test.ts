import  fs from '@/common/common.fs.ts'
// import { assert } from "https://deno.land/std@0.134.0/testing/asserts.ts";

// Deno.test("Hello Test", () => {
console.info(fs)

console.info()
//   assert("Hello");
// }); 

const a = fs.statSync('./readme.md')

// console.info(a)


// const b = fs.statSync('C:\\Users\\wimkf\\Desktop\\wor\\blog');
// console.info(b)

let fileList = fs.walkDirSync('/Users/chenxiaofang/Library/Containers/life.kfdykme.denk/Data/lowbeelocalhistory');
const statRes = fileList.filter(fileItem => {
    return fileItem.isFile
}).map(i => {
    const a  = Deno.statSync(i.path)
    return {
        size: a.size,
        birthtime: a.birthtime
    }
}).sort((a: any,b: any) => {
    
    return a.birthtime - b.birthtime
})
// console.info(statRes)

let size = 0
statRes.forEach(i => {
    size+= i.size
})

console.info(size)
