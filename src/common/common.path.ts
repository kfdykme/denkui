import os from '@/common/common.os.ts'

const homePath = () => {
    return '.'
    if (os.isWindows()) {
        return (Deno.env.get('HOMEDRIVE') || 'C:') + Deno.env.get('HOMEPATH')
    } else {
        return '.'
    }
}

export default {
    homePath
}