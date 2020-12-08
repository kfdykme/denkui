/*
 * @Author: kfdykme
 */

import logger from '../../log/console.ts'
const MANIFEST_FILE_NAME = 'manifest.json'

export default class ManifestLoader {
    rootPath:string = ''
    constructor(path:string) {
        this.rootPath = path
    }

    get():any {
        let decoder = new TextDecoder('utf-8')
        let path = this.rootPath + MANIFEST_FILE_NAME
        logger.info('ManifestLoader get ', path)
        try {
            let json = decoder.decode(Deno.readFileSync(path))
            logger.info("ManifestLoader manifest",json)
            return JSON.parse(json)

        } catch(e) {
            logger.error('AppLoader error',e, path)
            return {}
        }
    }
}