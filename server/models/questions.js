module.exports = class Question{
    constructor(id = null , question, true_count = 0 , false_count = 0, tta = null){
        this.id          = id
        this.question    = question
        this.true_count  = true_count
        this.false_count = false_count

        this.test_taker_answer = tta

        this.algorithms   = []
        this.answers      = []
        this.specificCompetencies = []
    }

    addAlgorithm = (Algorithm) =>{
        this.algorithms.push(Algorithm)
    }

    delAlgorithm = (Algorithm) =>{
        for(let i =0 ; i < this.algorithms.length ; ++i){
            if(this.algorithms[i].id == Algorithm.id){
                this.algorithms.splice(i , 1)
                return
            }
        }
    }

    clearAlgorithms = () =>{
        this.algorithms = []
    }

    getAlgorithms = () =>{
        return this.algorithms
    }

    addAnswer = (Answer) =>{
        this.answers.push(Answer)
    }

    delAnswer = (Answer) =>{
        for(let i =0 ; i < this.answers.length ; ++i){
            if(this.answers[i].id == Answer.id){
                this.answers.splice(i , 1)
                return
            }
        }
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
}