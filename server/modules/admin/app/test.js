const path  = require('path')
const repo  = require("../../../repository/testRepository.js")
const repoSubclass  = require("../../../repository/subclassRepository.js")
const repoClass     = require("../../../repository/classRepository.js")
const repoSchool    = require("../../../repository/schoolRepository.js")
const repoTopic     = require("../../../repository/topicRepository.js")
const repoSubject   = require("../../../repository/subjectRepository")
const repoQuestion  = require("../../../repository/questionRepository.js")

const Topic   = require("../../../models/topics.js")
const Subject   = require("../../../models/subjects.js")
const School    = require("../../../models/school.js")
const Class     = require("../../../models/class.js")
const Subclass  = require("../../../models/subclass.js")
const Test  = require("../../../models/tests.js")


const CoreCompetency = require("../../../models/coreCompetency.js")
const BaseCompetency = require("../../../models/baseCompetency.js")
const SpecificCompetency = require("../../../models/specificCompetency.js")
const Question = require("../../../models/questions")
const QuestionAnswers   = require("../../../models/questionAnswers");
const QuestionSpecificCompetency = require('../../../models/questionSpecificCompetencies.js')

const algos = JSON.parse(process.env.ALGOCODE)

exports.all = (req, res)=>{
    try{

        Promise.all([
            repo.all(),
            repoSubclass.all(true),
            repoClass.all(true),
            repoSchool.all(true),
            repoTopic.all(true),
            repoSubject.all(true),
        ]).then((values)=>{
            const tests     = values[0]
            const subclass  = values[1]
            const _class    = values[2]
            const school    = values[3]
            const topic     = values[4]
            const subject   = values[5]

            const subject_obj = {}
            const topic_obj   = {}
            const subclass_obj    = {}
            const class_obj       = {}
            const school_obj      = {}

            subject.forEach(element => {
                subject_obj[element.id] = new Subject(element.id, element.name)
            });

            topic.forEach(element => {
                const topic = new Topic(element.id, element.name, element.subject_id)
                topic_obj[element.id] = topic
                subject_obj[element.subject_id].addTopic(topic)
            })

            school.forEach(element => {
                school_obj[element.id] = new School(element.id, element.name)
            });

            _class.forEach(element => {
                class_obj[element.id] = new Class(element.id, element.school_id , element.name)
            })

            subclass.forEach(element =>{
                subclass_obj[element.id] = new Subclass(element.id, element.class_id , element.name)
                class_obj[element.class_id].addSubclass(subclass_obj[element.id])
            })

            const key = Object.keys(class_obj)
            for(let i =0 ; i < key.length; ++i ){
                school_obj[class_obj[key[i]].school_id].addClass(class_obj[key[i]])
            }


            for (let i = 0 ; i < tests.length; ++i){
                if(tests[i].subject_id !== null){
                    tests[i].setSubject(new Subject(tests[i].subject_id, subject_obj[tests[i].subject_id].name))
                }

                if(tests[i].topic_id !== null){
                    tests[i].setTopic( new Topic(tests[i].topic_id, topic_obj[tests[i].topic_id].name, tests[i].subject_id))
                }

                if(tests[i].subclass_id !== null){
                    tests[i].subclass = new Subclass(tests[i].subclass_id, tests[i].class_id , subclass_obj[tests[i].subclass_id].name)
                }

                if(tests[i].class_id !== null){
                    tests[i].class = new Class(tests[i].class_id, tests[i].school_id , class_obj[tests[i].class_id].name)
                }

                if(tests[i].school_id !== null){
                    tests[i].school = new School(tests[i].school_id, school_obj[tests[i].school_id].name)
                }
                
                tests[i].treshold = algos[tests[i].treshold_code]

            }

                res.send({
                    status : true,
                    data   : {
                        tests      : tests,
                        subjects   : Object.values(subject_obj),
                        schools    : Object.values(school_obj),
                        algos      : algos,
                    }
                })

        })

        // repo.all().then((result)=>{
        //     if(result){
        //         res.send({
        //             status : true,
        //             data   : {
        //                 matpel  : result
        //             }
        //         })
        //     }else{
        //         res.send({
        //             status  : false,
        //             message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        //         })
        //     }
        // })
      

    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.detail = (req,res) =>{
    const { test_id } = req.query
    try{
        repo.getQuestionIds(test_id).then((question_ids)=>{
            res.send({
                status  : true,
                data    : {
                    questions : question_ids,
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

exports.store = (req,res) => {
    const {value} = req.body
    try{
        if(value.title === null || value.title.length === 0 ){
            res.send({
                status  : false,
                message : "Judul Ujian tidak boleh kosong!"
            }); 
            return
        }else if(value.type === 1 ){
            if(value.treshold_code === null){
                res.send({
                    status  : false,
                    message : "Tipe Treshold/Algo tidak boleh kosong!"
                }); 
                return
            }
            
            if(value.subject_id === null){
                res.send({
                    status  : false,
                    message : "Mata Pelajaran tidak boleh kosong!"
                }); 
                return
            }

            if(value.topic_id === null){
                res.send({
                    status  : false,
                    message : "Topik tidak boleh kosong!"
                }); 
                return
            }

            value.date = (value.date == "" && value.date.length == 0)? null : value.date
            value.start = (value.start == "" && value.start.length == 0)? null : value.start
            value.end = (value.end == "" && value.end.length == 0)? null : value.end
        }else if(value.type === 0){
            if(value.date === null || value.date.length ===0){
                res.send({
                    status  : false,
                    message : "Tanggal Ujian tidak boleh kosong!"
                }); 
                return
            }

            if(value.start === null || value.start.length === 0){
                res.send({
                    status  : false,
                    message : "Jam Mulai Ujian tidak boleh kosong!"
                }); 
                return
            }

            if(value.end === null || value.end.length === 0){
                res.send({
                    status  : false,
                    message : "Jam Selesai Ujian tidak boleh kosong!"
                }); 
                return
            }
        }

        const test = new Test(value.id, null, value.type, value.title, value.description, 
            value.topic_id , value.subject_id, value.date, value.start, value.end, value.treshold_code,
            value.subclass_id, value.class_id, value.school_id, value.randomquestion, value.randomanswers )
        
        repo.store(test).then((result)=>{
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
        }); 
    }
}

exports.update = (req,res) =>{
    const {value} = req.body
    try{

        console.log(value)
        if(value.title === null || value.title.length === 0 ){
            res.send({
                status  : false,
                message : "Judul Ujian tidak boleh kosong!"
            }); 
            return
        }else if(value.type === 1 ){
            if(value.treshold_code === null){
                res.send({
                    status  : false,
                    message : "Tipe Treshold/Algo tidak boleh kosong!"
                }); 
                return
            }
            
            if(value.subject_id === null){
                res.send({
                    status  : false,
                    message : "Mata Pelajaran tidak boleh kosong!"
                }); 
                return
            }

            if(value.topic_id === null){
                res.send({
                    status  : false,
                    message : "Topik tidak boleh kosong!"
                }); 
                return
            }

            value.date = (value.date == "" && value.date.length == 0)? null : value.date
            value.start = (value.start == "" && value.start.length == 0)? null : value.start
            value.end = (value.end == "" && value.end.length == 0)? null : value.end
        }else if(value.type === 0){
            if(value.date === null || value.date.length ===0){
                res.send({
                    status  : false,
                    message : "Tanggal Ujian tidak boleh kosong!"
                }); 
                return
            }

            if(value.start === null || value.start.length === 0){
                res.send({
                    status  : false,
                    message : "Jam Mulai Ujian tidak boleh kosong!"
                }); 
                return
            }

            if(value.end === null || value.end.length === 0){
                res.send({
                    status  : false,
                    message : "Jam Selesai Ujian tidak boleh kosong!"
                }); 
                return
            }
        }

        const test = new Test(value.id, value.code, value.type, value.title, value.description, 
            value.topic_id , value.subject_id, value.date, value.start, value.end, value.treshold_code,
            value.subclass_id, value.class_id, value.school_id, value.randomquestion, value.randomanswers )
        repo.update(test).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menyimpan data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                })
            }
        })

        // res.send({
        //     status  : false,
        //     message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        // }); 
    }catch(err){
        console.log(err)
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        }); 
    }
}

exports.destroy = (req,res) => {
    const {value_ids} = req.body
    try{
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
                }); 
            } 
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        }); 
    }
}

exports.question = (req,res) =>{
    const { test_id, questions } = req.body
    try{
        repo.insertQuestion(test_id, questions).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menyimpan data!"
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
        }); 
    }
}