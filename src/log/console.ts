
const filters = [
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
        console.info(vars[0])
    },
    error:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.error(vars[0])
    },
    log:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.log(vars[0])
    }
}