import  fs from '@/common/common.fs.ts'
// import { assert } from "https://deno.land/std@0.134.0/testing/asserts.ts";

// Deno.test("Hello Test", () => {
console.info(fs)

console.info()
//   assert("Hello");
// }); 

const a = fs.walkDirSync('.').filter((value) => {
    return value.name.endsWith('.ts')
})

console.info(a)
