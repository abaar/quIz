module.exports = class QuestionAlgorithm{
    constructor(id = null , question_id , name, level , index ){
        this.id          = id
        this.question_id = question_id
        this.name        = name
        this.level       = level
        this.index       = index

        this.question    = null
    }

    setQuestion = (question) => {
        this.question = question
    }

    getQuestion = () =>{
        return this.question
    }
}