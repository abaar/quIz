module.exports = class Subject{
    constructor(id = null ,  name){
        this.id         = id
        this.name       = name
        this.topics   = []
    }

    addTopic = (topic) =>{
        this.topics.push(topic)
    }

    delTopic = (topic) =>{
        for(let i =0 ; i < this.topics.length ; ++i){
            if(this.topics[i].id == topic.id){
                this.topics.splice(i , 1)
                return
            }
        }
    }

    clearTopics = () =>{
        this.topics = []
    }

    getTopics = () =>{
        return this.topics
    }
}