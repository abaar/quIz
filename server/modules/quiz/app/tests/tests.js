const path  = require('path')
const TestTaker = require('../../../../models/testTakers.js')
const User = require('../../../../models/users.js')
const repo  = require("../../../../repository/testRepository.js")
const repoTaker = require("../../../../repository/testTakerRepository.js")
const repoQuestion = require("../../../../repository/questionRepository.js")
const e = require('express')

exports.index = (req,res) =>{
    let {id, subclass_id, class_id , school_id} = req.user
    const user = new User(id, null, null, null, null, null, subclass_id, class_id, school_id)
    try{
        repo.getByUser(user).then((tests) => {
            if(tests){
                res.send({
                    status  : true,
                    data    : tests
                });
            }
        });
    }catch(err){
        res.send({
            status  : 500,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.questionCount = (req, res) =>{
    let test_id = req.query.test_id
    try{
        repo.getQuestionIds(test_id).then((questionIds)=>{
            if(questionIds){
                res.send({
                    status  : true,
                    data    : questionIds.length
                })
            }
        })
    }catch(err){
        res.send({
            status  : 500,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.start = (req, res) =>{
    let {id, subclass_id, class_id , school_id} = req.user
    let test_id = req.body.test_id

    let test_taker = new TestTaker(null, test_id, id, new Date(), null)

    try{
        repo.getById(test_id, withQuestionId=true).then((test)=>{
            repoTaker.createIfNotExist(test_taker, {test_id: test.id, user_id:id}, test.type).then((result)=>{
                if(result){
                    let date = new Date(test.date)
                    let day  = date.getDate()
                    if(day < 10){
                        day = "0"+day
                    }

                    let month = date.getMonth()
                    if(month < 10){
                        month = "0" + month
                    }

                    let year    = date.getFullYear()
                    date        = year+"-"+month+"-"+day;
                    
                    let start   = new Date(`${date} ${test.start}`)
                    let end     = new Date(`${date} ${test.end}`)
                    let current = new Date()

                    if(current < start && date !== null){
                        res.send({
                            status : false,
                            message : "Ujian belum dimulai! Cobalah beberapa saat lagi!"
                        })
                    }else if(current > end && date !== null){
                        res.send({
                            status : false,
                            message : "Mohon maaf, Ujian telah selesai!"
                        })
                    }else{
                        if(!test){
                            res.send({
                                status : true,
                                data : null
                            })
                        }else{
                            repoQuestion.getQuestionByTest(test,id).then((questions)=>{
                                test.questions = questions
                                res.send({
                                    status : true,
                                    data   : test
                                })
                            })
                        }
                    }
                }else{
                    res.send({
                        status  : 500,
                        message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                    });
                }
            })
        })
    }catch(err){
        res.send({
            status  : 500,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.continue = (req, res) =>{
    let {id, subclass_id, class_id , school_id} = req.user
    let test_id = req.body.test_id

    try{
        repo.getById(test_id, withQuestionId=true).then((test)=>{

            let date = new Date(test.date)
            let day  = date.getDate()
            if(day < 10){
                day = "0"+day
            }

            let month = date.getMonth()
            if(month < 10){
                month = "0" + month
            }

            let year    = date.getFullYear()
            date        = year+"-"+month+"-"+day;
            
            let start   = new Date(`${date} ${test.start}`)
            let end     = new Date(`${date} ${test.end}`)
            let current = new Date()

            if(current < start && date !== null){
                res.send({
                    status : false,
                    message : "Ujian belum dimulai! Cobalah beberapa saat lagi!"
                })
            }else if(current > end && date !== null){
                res.send({
                    status : false,
                    message : "Mohon maaf, Ujian telah selesai!"
                })
            }else{
                if(!test){
                    res.send({
                        status : true,
                        data : null
                    })
                }else{
                    repoQuestion.getQuestionByTest(test, id).then((questions)=>{
                        test.questions = questions
                        res.send({
                            status : true,
                            data   : test
                        })
                    })
                }
            }
        })
    }catch(err){
        res.send({
            status  : 500,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}