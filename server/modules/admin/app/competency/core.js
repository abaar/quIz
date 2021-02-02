const path  = require('path')
const repo  = require("../../../../repository/coreCompetencyRepository.js")
const repoSubject  = require("../../../../repository/subjectRepository.js")
const repoTopic    = require("../../../../repository/topicRepository.js")
const repoClass    = require("../../../../repository/classRepository.js")

const Subject     = require("../../../../models/subjects.js")
const Topic       = require("../../../../models/topics.js")
const CoreCompetency = require("../../../../models/coreCompetency.js")
const Class       = require("../../../../models/class.js")


exports.all = (req, res)=>{
    try{
        Promise.all([
            repo.all(true),
            repoSubject.all(true),
            repoTopic.all(true),
            repoClass.all(true),
        ]).then((values)=>{
            let coreCompetency = values[0]
            let subject        = values[1]
            let topic          = values[2]
            let class_         = values[3]

            const subject_obj  = {}
            const topic_obj    = {}
            const class_obj    = {}

            const coreCompetency_obj = []

            subject.forEach(element => {
                subject_obj[element.id] = new Subject(element.id, element.name)
            });

            topic.forEach(element => {
                topic_obj[element.id] =  new Topic(element.id, element.name, element.subject_id)

                subject_obj[element.subject_id].addTopic(topic_obj[element.id])
                topic_obj[element.id].setSubject(new Subject(subject_obj[topic_obj[element.id].subject_id].id, subject_obj[topic_obj[element.id].subject_id].name ))
            })

            class_.forEach(element => {
                class_obj[element.id] = new Class(element.id, element.school_id , element.name)
            })

            coreCompetency.forEach(element =>{
                const core = new CoreCompetency(element.id, element.topic_id, element.name, element.description, element.class_id)

                if(element.topic_id !== null){
                    core.setTopic(topic_obj[element.topic_id])
                    core.setSubject(topic_obj[element.topic_id].getSubject())
                }

                if(element.class_id !== null){
                    core.setClass(class_obj[element.class_id])
                }

                coreCompetency_obj.push(core)
            })

            res.send({
                status  : true,
                data    : {
                    subjects : Object.values(subject_obj),
                    competencies : coreCompetency_obj,
                    classes : Object.values(class_obj)
                }
            });  
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });  
    }
}

exports.store = (req, res) =>{
    try{
        const { value } = req.body

        if(value.name === "" || value.name === null){
            res.send({
                status  : false,
                message : "Kompetensi Inti tidak boleh kosong!"
            })
            return
        }
        repo.store(new CoreCompetency(null, value.topic_id, value.name, value.description, value.class_id)).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menambahkan data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                })
            }
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        })
    }
}

exports.update = (req, res) => {
    try{
        const { value } = req.body
        if(value.name === "" || value.name === null){
            res.send({
                status  : false,
                message : "Kompetensi Inti tidak boleh kosong!"
            })
            return
        }
        repo.update(new CoreCompetency(value.id, value.topic_id, value.name, value.description, value.class_id)).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil mengubah data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                })
            }
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        })
    }
}

exports.destroy = (req, res) =>{
    try{
        const { value_ids } = req.body

        repo.destroy(value_ids).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menghapus data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                })
            }
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        })
    }
}