
const filters:string[] = [
    // 'FileLoader', 
    // 'FileLoader load loadSystem',
    // 'FileLoader load mport:',
    // 'FileLoader tag',
    'AppLoader',
    "DataBinder",
    'makeSureDir',
    // 'TAGREADER',
    "TagParser",
    "ManifestLoader",
    "TagData",
    // "IpcController",
    "FETCH",
    // 'HANDLE',
    // 'UxLoader',
    // 'CssLoader',
    'SYSTEM.ROUTER',
    // "LifeCycleController",
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
        console.info(new Date().toJSON(), ...vars)
    },
    error:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.error(new Date().toJSON(), ...vars)
    },
    log:(...vars: any[]) => {
        if(isFilted(vars)) return
        console.log(new Date().toJSON(), ...vars)
    },
    dev:(...vars: any[]) => { 
        console.log(new Date().toJSON(), ...vars)
    }
}