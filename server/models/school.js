module.exports = class School{
    constructor(id = null , name){
        this.id         = id
        this.name       = name

        this.classes  = [];
    }

    addClass = (clas) => {
        this.classes.push(clas);
    }

    clearClass = ()=>{
        this.classes = []
    }
    
}