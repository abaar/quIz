module.exports = class BaseCompetency{
    constructor(id = null , core_id , description = null ){
        this.id          = id
        this.core_id     = core_id
        this.description = description

        this.coreCompetency = null
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

    delSpecificCompetency = (SpecificCompetency) =>{
        for(let i =0 ; i < this.specificCompetencies.length ; ++i){
            if(this.specificCompetencies[i].id == SpecificCompetency.id){
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