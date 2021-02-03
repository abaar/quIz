module.exports = class Passage{
    constructor(id = null , subject_id, name,   passage){
        this.id         = id
        this.passage    = passage

        this.subject_id = subject_id
        this.name       = name
        this.subject    = null
    }

    setSubject = (subject) =>{
        this.subject = subject
    }
}