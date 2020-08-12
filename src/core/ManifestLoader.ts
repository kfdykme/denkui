/*
 * @Author: kfdykme
 */

const MANIFEST_FILE_NAME = 'manifest.json'

export default class ManifestLoader {
    rootPath:string = ''
    constructor(path:string) {
        this.rootPath = path
    }

    get():any {
        let decoder = new TextDecoder('utf-8')
        let json = decoder.decode(Deno.readFileSync(this.rootPath + MANIFEST_FILE_NAME))
        return JSON.parse(json)
    }
}