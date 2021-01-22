module.exports = class TestQuestion{
    constructor(id = null , test_id , specific_id = null , question_id = null){
        this.id             = id
        this.test_id        = test_id
        this.specific_id    = specific_id
        this.question_id    = question_id

        this.specific       = null
        this.test           = null
        this.question       = null
    }

    setQuestion = (Question) =>{
        this.question = Question
    }
    
    getQuestion = ()=>{
        return this.question
    }

    setSpecific = (Specific) => {
        this.specific = Specific
    }

    getSpecific = () =>{
        return this.specific
    }

    setTest = (Test) => {
        this.test = Test
    }

    getTest = () =>{
        return this.test
    }
}