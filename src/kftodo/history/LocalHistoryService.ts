
import logger from "@/log/console.ts";
import fs from "@/common/common.fs.ts";
import path from '@/common/common.path.ts';

/**
 * Feature 101 文件本地历史记录
 */
export class LocalHistoryService {
    /**
     * 处理文件历史记录的时候需要依赖当前的基础目录路径
     */
    basePath: string = ''
    /**
     * 最大缓存容量
     */
    MAX_STORAGE_LIMIT = 31457280

    /**
     * 
     */
    appContainerPath: string = Deno.env.get("HOME") + path.Dir.Spelator + 'lowbeelocalhistory'
    constructor() {

    }

    static Get(basePath:string):LocalHistoryService {
        const service = new LocalHistoryService()
        service.basePath = basePath
        return service
    }

    checkLocalHistorylimit() :Promise<boolean> {

        let fileList = fs.walkDirSync(this.appContainerPath);
        const statRes = fileList.filter(fileItem => {
            return fileItem.isFile
        }).map(i => {
            const a  = Deno.statSync(i.path)
            return {
                path: i.path,
                size: a.size,
                birthtime: a.birthtime
            }
        }).sort((a: any,b: any) => {
            return a.birthtime - b.birthtime
        })
        let size = 0
        statRes.forEach(i => {
            size+= i.size
        })
        if (size > this.MAX_STORAGE_LIMIT) {
            fs.unlinkFile(statRes[0].path)
            this.checkLocalHistorylimit()
        }
        return Promise.resolve(true)
    }

    _getFileKey(originPath: string) {
        let fileKey = originPath.replace(this.basePath, '') 
        if (fileKey.startsWith('/')) {
            fileKey = fileKey.substring(1)
        }

        return fileKey
    }

    _getTargetFolderPath(fileKey: string) {
        const curretnTargetFolderPath = this.appContainerPath + path.Dir.Spelator + fileKey
        return curretnTargetFolderPath
    }

    _makeSureDir(fileKey: string) {
        fs.mkdirSync(this._getTargetFolderPath(fileKey), { recursive: true });
    }
    
    onReadLocalHistory(originPath: string) {
        let fileKey = this._getFileKey(originPath)
        this._makeSureDir(fileKey)
        return fs.walkDirSync(this._getTargetFolderPath(fileKey)).sort((a: any, b: any) => {
            return a.path - b.path
        })
    }

    /**
     * 
     * @param originPath 写入的文件的原始路径
     * @param content 写入的文件的内容
     * @returns 
     */
    onWriteFile(originPath:string, content: string): Promise<boolean> {
        logger.info('LocalHistoryService', originPath, this.basePath, this.appContainerPath)
       
        let fileKey = this._getFileKey(originPath)

        this._makeSureDir(fileKey)
        
        fs.writeFileSync(this._getTargetFolderPath(fileKey) + path.Dir.Spelator + new Date().getTime(), content)

        
        this.checkLocalHistorylimit()


        return Promise.resolve(true)
    }
}