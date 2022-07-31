import Os from '@/common/common.os.ts'
import logger from '@/log/console.ts'

export interface HeaderInfo {
    path:string
    title: string
    date: string
    dateMs?: Number 
    tags:string[],
    type?: string 
}

const handleFile = (content: string, filePath: string):HeaderInfo => {
    logger.info(filePath)
    content =content.replace(/\r/g, '')
    let headerInfoReg = /^----*\n(.*\n)*---\n/
    // if (Os.isWindows())
    //     headerInfoReg = /^----*\r\n(.*\r\n)*---\r\n/
    // console.info()
    const header:any = headerInfoReg.exec(content)
    logger.info('header', header)
    let headerText = header && header[0].replace(/tag *:/, 'tags:')
    
    // get info from headerText
    const headerInfo: any = {}
    headerText?.split('\n').filter((line:string) => !line.includes('---')).forEach((line:string) => {
        if (line.includes(':')) {
            let values = line.split(':')
            const key = values[0].trim()
            let value = line.split(':')[1].trim()
            if (values.length > 2) {
                values = values.slice(1)
                value = values.join(':').trim()
            }
            if (value != "") {
                headerInfo[key] = value
                headerInfo.isArrayItem = false
            } else {
                headerInfo.isArrayItem = true
                headerInfo.arrItemTag = key
                headerInfo[key] = []
            }
        } else if (line.startsWith('-')) {
            if (headerInfo.isArrayItem) {
                headerInfo[headerInfo.arrItemTag].push(line.split('-')[1].trim().toLowerCase())
            }
        }
    })

    logger.info(headerText)
    if (headerText == null) {
        // headerInfo.title = 'UnTitle'
    }

    delete headerInfo.isArrayItem
    delete headerInfo.arrItemTag 
    
    if (!headerInfo.tags || 
        (headerInfo.tags && headerInfo.tags.length === 0)) {

        if (!headerInfo.tag || 
            (headerInfo.tag && headerInfo.tag.length === 0)) {
            headerInfo.tags = headerInfo.tag
        }
        headerInfo.tags = ['UnTag']
    }


    
    headerInfo.path = filePath
    logger.info(headerInfo)
    return headerInfo;
} 


export default {
    handleFile
}