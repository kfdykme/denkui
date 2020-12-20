import _console from '@/log/console.ts'


export default class Logger {
    name = ""
    constructor(name:string) {
        this.name = name
    }

    dev(...vars: any[]) { 
        _console.log(new Date(), ...[this.name, ...vars])
    }
}