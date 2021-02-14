module.exports = class Question{
    constructor(id = null , question, true_count = 0 , false_count = 0, tta = null, passage_id = null, image = null, is_katex = 0){
        this.id          = id
        this.question    = question
        this.true_count  = true_count
        this.false_count = false_count
        this.passage_id  = passage_id
        this.image       = image
        this.is_katex    = is_katex

        this.test_taker_answer = tta

        this.algorithms   = []
        this.answers      = []
        this.specificCompetencies = []

        this.subject      = null
    }

    addAlgorithm = (Algorithm) =>{
        this.algorithms.push(Algorithm)
    }


    addAnswer = (Answer) =>{
        this.answers.push(Answer)
    }

    clearAnswers = () =>{
        this.answers = []
    }

    getAnswers = () =>{
        return this.answers
    }

    addSpecificCompetency = (specificCompetency) =>{
        this.specificCompetencies.push(specificCompetency)
    }

    clearSpecificCompetencies = () =>{
        this.specificCompetencies = []
    }

    getSpecificCompetencies = () =>{
        return this.specificCompetencies
    }
}