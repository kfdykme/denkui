import  fs from '@/common/common.fs.ts'
// import { assert } from "https://deno.land/std@0.134.0/testing/asserts.ts";

// Deno.test("Hello Test", () => {
console.info(fs)

console.info()
//   assert("Hello");
// }); 

const a = fs.statSync('./readme.md')

console.info(a)


const b = fs.statSync('C:\\Users\\wimkf\\Desktop\\wor\\blog');
console.info(b)

const c = fs.walkDirSync('C:\\Users\\wimkf\\Desktop\\wor\\blog');
console.info(c)
 