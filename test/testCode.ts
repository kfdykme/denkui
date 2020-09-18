let a: any = {
    formIndex: 2
}

// let src = "{{formIndex === 2 ? 'top-tab-active' : ''}}"
let src = " top-tab-bar {{homeIndex == 0 ? '' : 'hide'}}"


let innerEval = (str:string, context:any) => {
    let targetStrReg = /\{\{.*?\}\}/g
    let res:string[]|null = targetStrReg.exec(str) 
    let tryEval = (str:string) => {
        str = str.replace('{{', '').replace('}}','')
        const reg = /([a-z]|[A-Z])(([a-z]|[A-Z]|[0-9])*)/
         str = "(function() {  return " + 
         str.split(' ')
         .filter((f:string) => {
             return f.trim() != ''
         })
         .map(i => {
             if (reg.test(i) && i.indexOf('\'') == -1) {
                 i = 'this.' + i
             }
             return i
         }).join(' ') + 
         "})" 
         return eval(str).call(context)
    }
    res?.forEach((i:string) => {
        str = str.replace(i, tryEval(i))
    })
    
     return str
}

src = innerEval(src, a)
console.info(src)

 
 
// console.info(f.call(a))
