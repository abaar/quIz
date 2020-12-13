module.exports = class QuestionAnswer{
    constructor(id = null , question_id , label, is_correct = false ){
        this.id          = id
        this.question_id = question_id
        this.label       = label
        this.is_correct  = is_correct

        this.question    = null
    }

    setQuestion = (question) => {
        this.question = question
    }

    getSQuestion = () =>{
        return this.question
    }
}