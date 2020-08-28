export class View {

    name:string 
    childs:View[]
    constructor(name:string) {
        this.name = name
        this.childs = []
    }
    
    toString() {
        return JSON.stringify(this, null, 4)
    }
}

