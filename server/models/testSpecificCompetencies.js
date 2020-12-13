module.exports = class TestSpecificCompeteny{
    constructor(id = null , test_id , specific_id){
        this.id             = id
        this.test_id        = test_id
        this.specific_id    = specific_id

        this.specific       = null
        this.test           = null
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