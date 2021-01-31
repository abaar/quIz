module.exports = class Subclass{
    constructor(id = null, class_id , name){
        this.id         = id
        this.class_id   = class_id
        this.name       = name

        this.school     = null
        this.class      = null
    }


    setClass = (clas)=>{
        this.class = clas
    }

    setSchool = (school)=>{
        this.school = schoo
    }
}