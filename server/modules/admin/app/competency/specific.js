const path  = require('path')

const repo         = require("../../../../repository/specificCompetencyRepository.js")
const repoBase     = require("../../../../repository/baseCompetencyRepository.js")
const repoCore     = require("../../../../repository/coreCompetencyRepository.js")
const repoSubject  = require("../../../../repository/subjectRepository.js")
const repoTopic    = require("../../../../repository/topicRepository.js")
const repoClass    = require("../../../../repository/classRepository.js")

const Subject     = require("../../../../models/subjects.js")
const Topic       = require("../../../../models/topics.js")
const CoreCompetency = require("../../../../models/coreCompetency.js")
const Class       = require("../../../../models/class.js")
const BaseCompetency = require("../../../../models/baseCompetency.js")
const SpecificCompetency = require("../../../../models/specificCompetency.js")

exports.all = (req, res)=>{
    try{
        Promise.all([
            repo.all(true),
            repoBase.all(true),
            repoSubject.all(true),
            repoTopic.all(true),
            repoClass.all(true),
            repoCore.all(true)
        ]).then((values)=>{
            const specificCompetency = values[0] 
            let baseCompetency = values[1]
            let subject        = values[2]
            let topic          = values[3]
            let class_         = values[4]
            let coreCompetency = values[5]

            const subject_obj  = {}
            const topic_obj    = {}
            const class_obj    = {}
            const coreCompetency_obj = {}
            const baseCompetency_obj = {}
            const specificCompetency_obj = []

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
                    topic_obj[element.topic_id].addCoreCompetency(core)

                    subject_obj[topic_obj[element.topic_id].subject_id].addTopic(topic_obj[element.topic_id])
                }

                coreCompetency_obj[element.id] = core
            })

            baseCompetency.forEach(element => {
                const base = new BaseCompetency(element.id, element.core_id , element.description)

                coreCompetency_obj[element.core_id].addBaseCompetency(base)
                baseCompetency_obj[element.id] = base
            })

            specificCompetency.forEach(element => {
                const specific = new SpecificCompetency(element.id, element.base_id, element.description)
                baseCompetency_obj[element.base_id].addSpecificCompetency(specific)

                const base  = baseCompetency_obj[element.base_id]
                const core  = coreCompetency_obj[base.core_id]
                const topic = topic_obj[core.topic_id]
                const clas_ = class_obj[core.class_id]
                const subj_ = subject_obj[topic.subject_id]



                specific.baseCompetency = {id : element.base_id, name : base.description}
                specific.coreCompetency = {id : core.id, name :core.name}
                specific.class = clas_.name
                specific.subject = { id : subj_.id, name : subj_.name}
                specific.topic = {id : topic.id, name : topic.name}

                specificCompetency_obj.push(specific)
            })

            res.send({
                status  : true,
                data    : {
                    subjects : Object.values(subject_obj),
                    competencies : Object.values(specificCompetency_obj),
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
        }else if(value.base_id === null || value.base_id === "" ){
            res.send({
                status  : false,
                message : "Pilihlah Kompetensi Dasar!"
            })
            return
        }

        repo.store(new SpecificCompetency(null, value.base_id, value.description)).then((result)=>{
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
        }else if(value.base_id === null || value.base_id === "" ){
            res.send({
                status  : false,
                message : "Pilihlah Kompetensi Dasar!"
            })
            return
        }

        repo.update(new SpecificCompetency(value.id, value.base_id, value.description)).then((result)=>{
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