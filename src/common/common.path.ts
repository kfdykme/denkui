import os from '@/common/common.os.ts'

const homePath = () => {
    return '.'
    if (os.isWindows()) {
        return (Deno.env.get('HOMEDRIVE') || 'C:') + Deno.env.get('HOMEPATH')
    } else {
        return '.'
    }
}

class Dir {
    constructor() {

    }

    static get Spelator() {
        if (os.isWindows()) {
            return '\\'
        } else {
            return '/'
        }
    }
}
    
    

const getDirPath = (filePath: string) => {
    if (filePath === '') return filePath

    return filePath.substring(0, filePath.lastIndexOf(Dir.Spelator))
}

export default {
    homePath,
    getDirPath,
    Dir
}