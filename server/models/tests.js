module.exports = class Test{
    constructor(id = null , code = null, type = 0, title= null, description= null , topic_id= null , subject_id= null , date= null, start= null, end= null, algorithm_id = null, user_id = null, subclass_id = null , class_id = null, school_id = null , randomquestion = 0 ,randomanswers = 0){
        this.id             = id
        this.code           = code
        this.type           = type
        this.title          = title
        this.description    = description
        this.topic_id       = topic_id
        this.subject_id     = subject_id
        this.date           = date
        this.start          = start
        this.end            = end
        this.algorithm_id   = algorithm_id
        this.user_id        = user_id
        this.subclass_id    = subclass_id
        this.class_id       = class_id
        this.school_id      = school_id
        this.randomquestion = randomquestion
        this.randomanswers  = randomanswers

        this.topic          = null
        this.subject        = null
        this.user           = null

        this.specificCompetencies   = []
        this.question_ids           = []
        this.questions              = []
        this.takers                 = []
        this.logs                   = []
    }

    setUser = (user) => {
        this.user = user
    }

    getUser = () => {
        return this.user
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

    addQuestionId = (qid) =>{
        this.question_ids.push(qid)
    }

    addQuestion = (question) =>{
        this.questions.push(question)
    }

    getQuestionLen = () =>{
        return (this.question_ids.length > this.questions.length)? this.question_ids.length : this.questions.length
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