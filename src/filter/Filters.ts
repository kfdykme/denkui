const FilterNotNull = (el:any) => {
    return el !== null
}

const FilterNotEmptyText = (text: string) => {
    return text !== ""
}

const FilterNotUndefined =  (el:any) => {
    return el !== undefined
}


const filters =  {
    FilterNotEmptyText,
    FilterNotNull,
    FilterNotUndefined,
}

export default filters