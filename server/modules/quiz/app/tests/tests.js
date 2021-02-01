const path  = require('path')
const TestTaker = require('../../../../models/testTakers.js')
const User = require('../../../../models/users.js')
const repo  = require("../../../../repository/testRepository.js")
const repoTaker = require("../../../../repository/testTakerRepository.js")
const repoQuestion = require("../../../../repository/questionRepository.js")
const repoTestTakerAnswer = require("../../../../repository/testTakerAnswersRepository.js")
const e = require('express')
const db = require('../../../../config/db.js')

exports.index = (req,res) =>{
    let {id, subclass_id, class_id , school_id} = req.user
    const user = new User(id,null,null,null,null, true, subclass_id, class_id, school_id)
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
            status  : false,
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
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.refresh = (req, res) =>{
    let {id, subclass_id, class_id , school_id} = req.user
    let test_id = req.body.data.test_id

    try{
        repo.getById(test_id).then((test)=>{
            if(test){
                let date = new Date(test.date)
                let day  = date.getDate()
                if(day < 10){
                    day = "0"+day
                }

                let month = date.getMonth() + 1
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
                        status  : false,
                        code    : -1, 
                        message : "Ujian diundur / belum dimulai! Cobalah beberapa saat lagi!"
                    })
                }else if(current > end && date !== null){
                    res.send({
                        status  : false,
                        code    : 1,
                        message : "Mohon maaf, Ujian telah selesai!"
                    })

                    try{
                        repo.getById(test_id, withQuestionId=true).then((test)=>{
                            let question_count  = test.getQuestionLen()
                            Promise.all([
                                repoTestTakerAnswer.sumOfCorrectAnswers(new TestTaker(null, test.id, id)),
                                repoTestTakerAnswer.deletedSumOfTest(new TestTaker(null, test.id, id)),
                                repoTestTakerAnswer.getByTestTaker(new TestTaker(null, test.id, id))
                            ]).then((values) =>{
                                let sumOfCorrectAnswers = values[0]
                                let sumOfDeletedAnswers = values[1]
                                let testTakerAnswers    = values[2]
                                if(!sumOfCorrectAnswers){
                                    return
                                    //exit
                                }else{
                                    let scores = (sumOfCorrectAnswers.correct_total / question_count) * 100
                                    
                                    for(let i =0 ; i < testTakerAnswers.length; ++i ){
                                        if(testTakerAnswers[i].id in sumOfDeletedAnswers)
                                            testTakerAnswers[i].time_needed_in_seconds += sumOfDeletedAnswers[testTakerAnswers[i].id]
                                    }
                
                                    repoTaker.finish(new TestTaker(null, test.id, id), testTakerAnswers, scores).then((result)=>{
                                        return
                                    })
                                }
                            })
                        })
                    }catch(err){
                        return
                    }

                }else if(current < end){
                    res.send({
                        status : true,
                        data   : {
                            end : test.end
                        }
                    })
                }
            }
        })
    }
    catch(err){
        res.send({
            status  : false,
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

                    let month = date.getMonth() + 1
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
                                test.start     = new Date()
                                res.send({
                                    status : true,
                                    data   : test
                                })
                            })
                        }
                    }
                }else{
                    res.send({
                        status  : false,
                        message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                    });
                }
            })
        })
    }catch(err){
        res.send({
            status  : false,
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

            let month = date.getMonth()  + 1
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
                        test.start     = new Date()
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
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.finish = (req, res) =>{
    const {id, subclass_id, class_id , school_id} = req.user
    let test_id = req.body.test_id

    try{
        repo.getById(test_id, withQuestionId=true).then((test)=>{
            let question_count  = test.getQuestionLen()
            Promise.all([
                repoTestTakerAnswer.sumOfCorrectAnswers(new TestTaker(null, test.id, id)),
                repoTestTakerAnswer.deletedSumOfTest(new TestTaker(null, test.id, id)),
                repoTestTakerAnswer.getByTestTaker(new TestTaker(null, test.id, id))
            ]).then((values) =>{
                let sumOfCorrectAnswers = values[0]
                let sumOfDeletedAnswers = values[1]
                let testTakerAnswers    = values[2]
                if(!sumOfCorrectAnswers){
                    res.send({
                        status  : false,
                        message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                    });
                    //exit
                }else{
                    let scores = (sumOfCorrectAnswers.correct_total / question_count) * 100
                    
                    for(let i =0 ; i < testTakerAnswers.length; ++i ){
                        if(testTakerAnswers[i].id in sumOfDeletedAnswers)
                            testTakerAnswers[i].time_needed_in_seconds += sumOfDeletedAnswers[testTakerAnswers[i].id]
                    }

                    repoTaker.finish(new TestTaker(null, test.id, id), testTakerAnswers, scores).then((result)=>{
                       
                        if(result){
                            res.send({
                                status  : true,
                                message : "Ujian telah selesai..."
                            });
                        }else{
                            res.send({
                                status  : false,
                                message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                            });
                        }

                    })
                }
            })
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}