
const filters:string[] = [
    'FileLoader', 
    // 'FileLoader load loadSystem',
    // 'FileLoader load mport:',
    // 'FileLoader tag',
    // 'AppLoader',
    'makeSureDir',
    'TAGREADER',
    "TagParser",
    "ManifestLoader",
    "TagData",
    "IpcController",
    "FETCH",
    'HANDLE',
    "LifeCycleController"
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
        console.info(new Date(), ...vars)
    },
    error:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.error(new Date(), ...vars)
    },
    log:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.log(new Date(), ...vars)
    }
}