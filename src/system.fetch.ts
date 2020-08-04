// let res = await fetch('http://www.qq.com')
// console.info(await res.text())
 
export default {
    fetch: (o:any)=> {
        console.info("FETCH FETCH",o)
        return o
    }
}