module.exports = class Topic{
    constructor(id = null , name, subject_id = null){
        this.id         = id
        this.name       = name
        this.subject_id = subject_id
        
        this.subject    = null
        this.coreCompetencies = []
    }

    setSubject = (subject) => {
        this.subject = subject
    }

    getSubject = () =>{
        return this.subject
    }

    addCoreCompetency = (CoreCompetency) =>{
        this.coreCompetencies.push(CoreCompetency)
    }

    delCoreCompetency = (CoreCompetency) =>{
        for(let i =0 ; i < this.coreCompetencies.length ; ++i){
            if(this.coreCompetencies[i].id == CoreCompetency.id){
                this.coreCompetencies.splice(i , 1)
                return
            }
        }
    }

    clearCoreCompetencies = () =>{
        this.coreCompetencies = []
    }

    getCoreCompetencies = () =>{
        return this.coreCompetencies
    }
}