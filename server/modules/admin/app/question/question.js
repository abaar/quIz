const path  = require('path')
const formidable  = require("formidable")
const fs = require("fs");
const repo         = require("../../../../repository/questionRepository.js")
const repoSpecific = require("../../../../repository/specificCompetencyRepository.js")
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
const Question = require("../../../../models/questions")
const QuestionAnswers   = require("../../../../models/questionAnswers");
const QuestionSpecificCompetency = require('../../../../models/questionSpecificCompetencies.js')

function readImageFile(file) {
    const bitmap = fs.readFileSync(file);
    const buffer = Buffer.from(bitmap)
    return buffer;
}

exports.all = (req, res)=>{
    try{
        // console.log(JSON.parse(process.env.ALGOCODE))
        Promise.all([
            repo.all(true),
            repoSpecific.all(true),
            repoBase.all(true),
            repoSubject.all(true),
            repoTopic.all(true),
            repoClass.all(true),
            repoCore.all(true)
        ]).then((values)=>{
            const questions = values[0]
            const specificCompetency = values[1] 
            let baseCompetency = values[2]
            let subject        = values[3]
            let topic          = values[4]
            let class_         = values[5]
            let coreCompetency = values[6]


            const subject_obj  = {}
            const topic_obj    = {}
            const class_obj    = {}
            const coreCompetency_obj = {}
            const baseCompetency_obj = {}
            const specificCompetency_obj = {}
            const questions_obj = []

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

                specificCompetency_obj[element.id] = specific
            })

            for (let i =0 ; i < questions.length; ++i){
                for (let j =0 ; j < questions[i].specificCompetencies.length; ++j){
                    questions[i].specificCompetencies[j].specificCompetency = specificCompetency_obj[questions[i].specificCompetencies[j].specific_id]
                    questions[i].subject = specificCompetency_obj[questions[i].specificCompetencies[j].specific_id].subject
                }
            }

            res.send({
                status  : true,
                data    : {
                    subjects : Object.values(subject_obj),
                    questions : Object.values(questions),
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
        const formData = formidable.IncomingForm()
        new Promise((resolve,reject)=>{
            formData.parse(req, function(err, fields, files){
                let soal_image = null;
                if("file" in files){
                    soal_image = readImageFile(files.file.path);
                }
                if(fields.question.length === 0 || fields.question === null || fields.question === "undefined"){
                }else if(fields.answers.length === 0 || fields.answers.length === null  || fields.answers === "undefined"){
                    res.send({
                        status  : false,
                        message : "Minimal ada 1 pilihan jawaban!"
                    })
                    return
                }
                const question = new Question(null,fields.question, 0, 0, null, (fields.passage_id === "undefined" || fields.passage_id.length === 0)? null:fields.passage_id, soal_image, fields.is_katex)
                const answers  = JSON.parse(fields.answers)
                const specifics= JSON.parse(fields.specifics)

                for(let i =0 ; i < answers.length; ++i){
                    question.addAnswer(new QuestionAnswers(null, null, answers[i].label, answers[i].is_correct))
                }

                for (let i =0; i < specifics.length; ++i){
                    question.addSpecificCompetency(new QuestionSpecificCompetency(null, null, specifics[i].value))
                }

                resolve({
                    status: true,
                    data  : question
                })
            })
        }).then((result)=>{
            if(result.status){
                const question = result.data
                repo.store(question).then((result)=>{
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
            }
        })

    }catch(err){
        console.log(err)
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        })
    }
}

exports.update = (req, res) => {
    try{
        const formData = formidable.IncomingForm()
        new Promise((resolve,reject)=>{
            formData.parse(req, function(err, fields, files){
                
                let soal_image = null;
                if("previmage" in files){
                    soal_image = readImageFile(files.previmage.path);
                    if(parseInt(fields.deleteImage) === 1){
                        soal_image = null
                    }
                }

                if("file" in files){
                    soal_image = readImageFile(files.file.path);
                }

                if(fields.question.length === 0 || fields.question === null || fields.question === "undefined"){
                }else if(fields.answers.length === 0 || fields.answers.length === null  || fields.answers === "undefined"){
                    res.send({
                        status  : false,
                        message : "Minimal ada 1 pilihan jawaban!"
                    })
                    return
                }
                const question = new Question(fields.id,fields.question, 0, 0, null, (fields.passage_id === "undefined" || fields.passage_id.length === 0)? null:fields.passage_id, soal_image, fields.is_katex)
                const answers  = JSON.parse(fields.answers)
                const specifics= JSON.parse(fields.specifics)

                for(let i =0 ; i < answers.length; ++i){
                    question.addAnswer(new QuestionAnswers(null, null, answers[i].label, answers[i].is_correct))
                }

                for (let i =0; i < specifics.length; ++i){
                    question.addSpecificCompetency(new QuestionSpecificCompetency(null, null, specifics[i].value))
                }

                resolve({
                    status: true,
                    data  : question
                })
            })
        }).then((result)=>{
            if(result.status){
                const question = result.data
                repo.update(question).then((result)=>{
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
            }
        })

    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        })
    }
    // try{
    //     const { value } = req.body

    //     if(value.question.length === 0 || value.question === null){
    //         res.send({
    //             status  : false,
    //             message : "Soal tidak boleh kosong!"
    //         })
    //         return
    //     }else if(value.answers.length === 0 || value.answers.length === null ){
    //         res.send({
    //             status  : false,
    //             message : "Minimal ada 1 pilihan jawaban!"
    //         })
    //         return
    //     } 


    //     const question = new Question(value.id,value.question, value.true_count, value.false_count, null, value.passage_id, value.image, value.is_katex)

    //     for(let i =0 ; i < value.answers.length; ++i){
    //         question.addAnswer(new QuestionAnswers(value.answers[i].id,value.id, value.answers[i].label, value.answers[i].is_correct))
    //     }

    //     for (let i =0; i < value.specifics.length; ++i){
    //         question.addSpecificCompetency(new QuestionSpecificCompetency(value.specifics[i].id, value.id, value.specifics[i].value))
    //     }


    //     repo.update(question).then((result)=>{
    //         if(result){
    //             res.send({
    //                 status  : true,
    //                 message : "Berhasil menambahkan data!"
    //             })
    //         }else{

    //             res.send({
    //                 status  : false,
    //                 message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
    //             })
    //         }
    //     })
    // }catch(err){
    //     res.send({
    //         status  : false,
    //         message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
    //     })
    // }
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