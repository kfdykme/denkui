const filePath = '../lowbee/src/View/Pages/Containor/containor.ux'

const tag = 'style'
let reg = new RegExp("\<" + tag + "(.*?)\>(.*(\r\n|\r|\n))?((.*(\r\n|\r|\n))*)\<\/" + tag + "\>")
if (Deno.build.os === "windows") {
    reg = new RegExp("\<" + tag + "(.*?)\>(.*(\r\n))?((.*(\r\n))*)\<\/" + tag + "\>")
}
let decoder = new TextDecoder('utf-8')
const content = decoder.decode(Deno.readFileSync(filePath))
let result = reg.exec(content)
console.info('TAGREADER exec content result', result)