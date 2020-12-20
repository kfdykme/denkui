
export default class LoadTagResult {
    content =  ""
    targetFilePath =  ""

    constructor(content:string, path:string) {
        this.content = content
        this.targetFilePath = path
    }
}