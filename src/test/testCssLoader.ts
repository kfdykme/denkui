import LoaderManager from '@/core/loader/LoaderManager.ts'

let a = LoaderManager.get().cssLoader

console.info(a)
console.info(LoaderManager.get())