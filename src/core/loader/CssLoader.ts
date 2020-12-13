import LoaderManager from '@/core/loader/LoaderManager.ts'
/**
 * CssLoader 传入CSS的文本， 给出结构
 */

export default class CssLoader {

    name:String = "CssLoader"

    static get() {
        return LoaderManager.get().cssLoader
    }
}
