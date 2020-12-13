import CssLoader from "@/core/loader/CssLoader.ts"; 
import {FileLoader} from "@/core/loader/FileLoader.ts";
import {UxLoader} from '@/core/loader/UxLoader.ts';
import {AppLoader} from '@/core/loader/AppLoader.ts'



let sInstance: LoaderManager|null = null
export default class LoaderManager {

    cssLoader:CssLoader = new CssLoader()

    fileLoader:FileLoader = new FileLoader()

    uxLoader:UxLoader = new UxLoader()

    appLoader:AppLoader = new AppLoader()

    static get() {
        if (sInstance === null) {
            sInstance = new LoaderManager()
        }
        return sInstance
    }
}