
export class BlogTextHelper {
    static GenerateEmptyText(title: string = '${title}', tags: string[] = ['${tag}'], content:string = ''): string {
        const res = 
        `---
title: ${title}
date: ${new Date().toLocaleString()}
tags:
${tags.map(value => {
    return `- ${value}
`
})}
---
${content}






`
        return res
    } 

    static GetHeaderInfoFromText(fullContent: string): string {
        fullContent =fullContent.replace(/\r/g, '')
        let headerInfoReg = /^----*\n(.*\n)*---\n/ 
        const header:any = headerInfoReg.exec(fullContent) 
        const headerText = header && header[0] 
        return headerText
    }

    static GetContentFromText(fullContent: string):string  {

        const headerText = BlogTextHelper.GetHeaderInfoFromText(fullContent)
        return fullContent.replace(headerText, '')
    }
}


