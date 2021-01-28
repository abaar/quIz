module.exports = class TestTakerAnswer{
    constructor(user_id , test_id , answers_id , question_id , is_correct = false, timestamps, time_needed_in_seconds = 0){
        this.user_id                = user_id
        this.test_id                = test_id
        this.answers_id             = answers_id
        this.question_id            = question_id
        this.is_correct             = is_correct
        this.timestamps             = timestamps
        this.time_needed_in_seconds = time_needed_in_seconds

        this.user       = null
        this.question   = null
        this.answers    = null
        this.test       = null
    }


    setUser = (User) => {
        this.user = User
    }

    getUser = () =>{
        return this.user
    }

    setTest = (Test) => {
        this.test = Test
    }

    getTest = () =>{
        return this.test
    }

    setQuestion = (question) => {
        this.question = question
    }

    getQuestion = () =>{
        return this.question
    }

    setAnswer = (answers) => {
        this.answers = answers
    }

    getAnswer = () =>{
        return this.answers
    }
}