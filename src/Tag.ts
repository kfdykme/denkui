export class TagData {
    params:any
    content: string
    path:string
    name:string
    constructor (params:any, content:string,path:string = '') {
        this.params = params;
        this.content = content;
        let arr = path.split(/(\/|\\\\)/g)
        this.name = arr.splice(arr.length-1)[0]
        this.path = arr.join('')
    }

    toString() {
        return JSON.stringify(this, null, 4)
    }
}