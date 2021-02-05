module.exports = class QuestionSpecificCompetency{
    constructor(id = null , question_id , specific_id ){
        this.id          = id
        this.question_id = question_id
        this.specific_id = specific_id

        this.specificCompetency    = null 
        this.question    = null
    }

    setQuestion = (question) => {
        this.question = question
    }

    getSQuestion = () =>{
        return this.question
    }
}