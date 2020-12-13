module.exports = class SpecificCompetency{
    constructor(id = null , base_id , description = null ){
        this.id          = id
        this.base_id     = base_id
        this.description = description

        this.baseCompetency = null
        this.questions = []
    }

    setBaseCompetency = (baseCompetency) => {
        this.baseCompetency = baseCompetency
    }

    getBaseCompetency = () =>{
        return this.baseCompetency
    }

    addQuestion = (Question) =>{
        this.questions.push(Question)
    }

    delQuestion = (Question) =>{
        for(let i =0 ; i < this.questions.length ; ++i){
            if(this.questions[i].id == Question.id){
                this.questions.splice(i , 1)
                return
            }
        }
    }

    clearQuestions = () =>{
        this.questions = []
    }

    getQuestions = () =>{
        return this.questions
    }
}