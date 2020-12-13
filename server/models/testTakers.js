module.exports = class TestTaker{
    constructor(id = null , test_id, user_id , start , end, score = 0){
        this.id         = id
        this.test_id    = test_id
        this.user_id    = user_id
        this.start      = start
        this.end        = end
        this.score      = score

        this.user       = null
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
}