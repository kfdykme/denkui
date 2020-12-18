import LoaderManager from '@/core/loader/LoaderManager.ts'
import logger from "@/log/console.ts";
/**
 * CssLoader 传入CSS的文本， 给出结构
 */

export default class CssLoader {

    name:String = "CssLoader"

    static get() {
        return LoaderManager.get().cssLoader
    }

    /**
     * 
     * @param content css/less 文本
     */
    public load (content:string) {
        let cssLineStack = []

        let lines:string[] = content.split('\n')
            .map((l:string) => l.trim())

        
    }
}
