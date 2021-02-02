module.exports = class CoreCompetency{
    constructor(id = null , topic_id , name = null , description , class_ = null ){
        this.id          = id
        this.topic_id    = topic_id
        this.name        = name
        this.description = description
        this.class_id    = class_
        
        this.subject     = null
        this.class       = null
        this.topic       = null
        this.baseCompetencies = []
    }

    setSubject = (subject) =>{
        this.subject    = subject
    }

    setTopic = (topic) => {
        this.topic = topic
    }

    getTopic = () =>{
        return this.topic
    }

    setClass = (class_) => {
        this.class = class_
    }

    addBaseCompetency = (BaseCompetency) =>{
        this.baseCompetencies.push(BaseCompetency)
    }

    delBaseCompetency = (BaseCompetency) =>{
        for(let i =0 ; i < this.baseCompetencies.length ; ++i){
            if(this.baseCompetencies[i].id == BaseCompetency.id){
                this.baseCompetencies.splice(i , 1)
                return
            }
        }
    }

    clearBaseCompetencies = () =>{
        this.baseCompetencies = []
    }

    getBaseCompetencies = () =>{
        return this.baseCompetencies
    }
}