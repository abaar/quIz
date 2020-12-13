module.exports  = class TestLog{
    constructor(id = null, test_id , question, question_id , specific, specific_id , name , value , user_id , created_at){
        this.id             = id
        this.test_id        = test_id
        this.question       = question
        this.question_id    = question_id
        this.specific       = specific
        this.specific_id    = specific_id
        this.name           = name
        this.value          = value
        this.user_id        = user_id
        this.created_at     = created_at

        this.question_obj   = null
        this.specific_obj   = null
        this.user_obj       = null
        this.test_obj       = null
    }

    setUser = (User) => {
        this.user_obj = User
    }

    getUser = () =>{
        return this.user_obj
    }

    setTest = (Test) => {
        this.test_obj = Test
    }

    getTest = () =>{
        return this.test_obj
    }

    setQuestion = (question) => {
        this.question = question
    }

    getQuestion = () =>{
        return this.question
    }

    setSpecific = (specific_obj) => {
        this.specific_obj = specific_obj
    }

    getSpecific = () =>{
        return this.specific_obj
    }
}