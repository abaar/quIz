module.exports = class BaseCompetency{
    constructor(id = null , core_id , description = null ){
        this.id          = id
        this.core_id     = core_id
        this.description = description

        this.coreCompetency = null
        this.class          = null
        this.topic          = null
        this.subject        = null
        this.specificCompetencies = []
    }

    setCoreCompetency = (coreCompetency) => {
        this.coreCompetency = coreCompetency
    }

    getCoreCompetency = () =>{
        return this.coreCompetency
    }

    addSpecificCompetency = (SpecificCompetency) =>{
        this.specificCompetencies.push(SpecificCompetency)
    }

    getSpecificCompetencies = () =>{
        return this.specificCompetencies
    }
}