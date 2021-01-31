module.exports = class Class{
    constructor(id = null, school_id , name){
        this.id         = id
        this.school_id  = school_id
        this.name       = name

        this.school     = null
        this.subclass   = []
    }


    addSubclass = (subclass)=>{
        this.subclass.push(subclass)
    }

    clearSubclass = () => {
        this.subclass = []
    }

    setSchool = (school)=>{
        this.school = schoo
    }
}