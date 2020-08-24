
const filters:string[] = [
    'FileLoader', 
    'TAGREADER'
]

const isFilted = (...vars:any[]) => {
    let res = filters.filter(filter => {
        return typeof vars[0][0] === 'string' &&
        vars[0][0].includes(filter)
    })
    // console.info(typeof vars[0][0],filters,res)
    return res.length != 0
}



export default  {
    info: (...vars: any[]) => {
        if(isFilted(vars)) return 
        console.info(...vars)
    },
    error:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.error(...vars)
    },
    log:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.log(...vars)
    }
}