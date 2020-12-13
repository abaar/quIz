module.exports = class Test{
    constructor(id = null , description , topic_id , subject_id , date, start, end){
        this.id             = id
        this.description    = description
        this.topic_id       = topic_id
        this.subject_id     = subject_id
        this.date           = date
        this.start          = start
        this.end            = end

        this.topic          = null
        this.subject        = null

        this.specificCompetencies   = []
        this.takers                 = []
        this.logs                   = []
    }

    setTopic = (topic) => {
        this.topic = topic
    }

    getTopic = () =>{
        return this.topic
    }

    setSubject = (subject) => {
        this.subject = subject
    }

    getSubject = () =>{
        return this.subject
    }

    addSpecificCompetency = (specificCompetency) =>{
        this.specificCompetencies.push(specificCompetency)
    }

    delSpecificCompetency = (specificCompetency) =>{
        for(let i =0 ; i < this.specificCompetencies.length ; ++i){
            if(this.specificCompetencies[i].id == specificCompetency.id){
                this.specificCompetencies.splice(i , 1)
                return
            }
        }
    }

    clearSpecificCompetencies = () =>{
        this.specificCompetencies = []
    }

    getSpecificCompetencies = () =>{
        return this.specificCompetencies
    }
 
    addTaker = (taker) =>{
        this.takers.push(taker)
    }

    delTaker = (taker) =>{
        for(let i =0 ; i < this.takers.length ; ++i){
            if(this.takers[i].id == taker.id){
                this.takers.splice(i , 1)
                return
            }
        }
    }

    clearTakers = () =>{
        this.takers = []
    }

    getTakers = () =>{
        return this.takers
    }
    
    addLog = (logs) =>{
        this.logs.push(logs)
    }

    delLog  = (logs) =>{
        for(let i =0 ; i < this.logs.length ; ++i){
            if(this.logs[i].id == logs.id){
                this.logs.splice(i , 1)
                return
            }
        }
    }

    clearLogs = () =>{
        this.logs = []
    }

    getLogs = () =>{
        return this.logs
    }
}