

/**
 * type :
 * denkuiblog -- blog
 * text -- text
 */

const getDefaultFileExtByType = (type:string):string => {
    if (type === 'denkuiblog') {
        return 'md'
    }

    if (type === 'text') {
        return 'denkuitext'
    }

    if (type === 'script') {
        return 'js'
    }

    return 'DENKNONONONONNONONONO'
}
// 约定 
const getFileExtByType = (type: string, config: any):string => {
    if (!config || !config.filterFiles) {
        return getDefaultFileExtByType(type)
    }

    const filter = config.filterFiles
    if (typeof filter == 'object' && filter instanceof Array) {
        for(let x in filter) {
            const v:any = filter[x]
            if (v.type === type) {
                return v.ext
            }
        }
        
    }
    return getDefaultFileExtByType(type)
}


export default {
    getFileExtByType
}