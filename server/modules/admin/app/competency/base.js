const path  = require('path')

const repo         = require("../../../../repository/baseCompetencyRepository.js")
const repoCore     = require("../../../../repository/coreCompetencyRepository.js")
const repoSubject  = require("../../../../repository/subjectRepository.js")
const repoTopic    = require("../../../../repository/topicRepository.js")
const repoClass    = require("../../../../repository/classRepository.js")

const Subject     = require("../../../../models/subjects.js")
const Topic       = require("../../../../models/topics.js")
const CoreCompetency = require("../../../../models/coreCompetency.js")
const Class       = require("../../../../models/class.js")
const BaseCompetency = require("../../../../models/baseCompetency.js")

exports.all = (req, res)=>{
    try{
        Promise.all([
            repo.all(true),
            repoSubject.all(true),
            repoTopic.all(true),
            repoClass.all(true),
            repoCore.all(true)
        ]).then((values)=>{
            let baseCompetency = values[0]
            let subject        = values[1]
            let topic          = values[2]
            let class_         = values[3]
            let coreCompetency = values[4]

            const subject_obj  = {}
            const topic_obj    = {}
            const class_obj    = {}
            const coreCompetency_obj = {}

            const baseCompetency_obj = []


            subject.forEach(element => {
                subject_obj[element.id] = new Subject(element.id, element.name)
            });

            topic.forEach(element => {
                topic_obj[element.id] =  new Topic(element.id, element.name, element.subject_id)
            })

            class_.forEach(element => {
                class_obj[element.id] = new Class(element.id, element.school_id , element.name)
            })

            coreCompetency.forEach(element =>{
                const core = new CoreCompetency(element.id, element.topic_id, element.name, element.description, element.class_id)
                if(element.class_id !== null){
                    core.setClass(class_obj[element.class_id])
                }

                if(element.topic_id !== null){
                    const topic = topic_obj[element.topic_id]

                    topic_obj[element.topic_id].addCoreCompetency(core)

                    subject_obj[topic_obj[element.topic_id].subject_id].addTopic(topic_obj[element.topic_id])
                }

                coreCompetency_obj[element.id] = core
            })

            baseCompetency.forEach(element => {
                const base = new BaseCompetency(element.id, element.core_id , element.description)
                const core = coreCompetency_obj[element.core_id]

                coreCompetency_obj[element.core_id].addBaseCompetency(base)

                base.coreCompetency = { name : core.name, id : core.id}
                base.class = class_obj[core.class_id].name
                base.topic = {name : topic_obj[core.topic_id].name, id : core.topic_id}
                base.subject = {name : subject_obj[topic_obj[core.topic_id].subject_id].name, id: topic_obj[core.topic_id].subject_id}
                baseCompetency_obj.push(base)
            })

            res.send({
                status  : true,
                data    : {
                    subjects : Object.values(subject_obj),
                    competencies : Object.values(baseCompetency_obj),
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

        if(value.description === "" || value.description === null){
            res.send({
                status  : false,
                message : "Kompetensi Dasar tidak boleh kosong!"
            })
            return
        }else if(value.core_id === null || value.core_id === "" ){
            res.send({
                status  : false,
                message : "Pilihlah Kompetensi Inti!"
            })
            return
        }

        repo.store(new BaseCompetency(null, value.core_id, value.description)).then((result)=>{
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

        if(value.description === "" || value.description === null){
            res.send({
                status  : false,
                message : "Kompetensi Dasar tidak boleh kosong!"
            })
            return
        }else if(value.core_id === null || value.core_id === "" ){
            res.send({
                status  : false,
                message : "Pilihlah Kompetensi Inti!"
            })
            return
        }
        repo.update(new BaseCompetency(value.id, value.core_id, value.description)).then((result)=>{
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