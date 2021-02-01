const repo          = require("../../../../repository/testTakerAnswersRepository.js")
const repoTest      = require("../../../../repository/testRepository.js") 
const repoTaker     = require("../../../../repository/testTakerRepository.js")
const TestTakerAnswer   = require('../../../../models/testTakerAnswers.js')
const TestTaker         = require('../../../../models/testTakers.js')

exports.submit = (req, res) =>{
    const {id, subclass_id, class_id , school_id} = req.user
    const {test_id} = req.body.data
        repoTest.getById(test_id).then((test)=>{
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
                        message : "Ujian belum dimulai! Cobalah beberapa saat lagi!"
                    })
                }else if(current > end && date !== null){
                    res.send({
                        status  : false,
                        code    : 1,
                        message : "Mohon maaf, Ujian telah selesai!"
                    })

                    try{
                        repoTest.getById(test_id, withQuestionId=true).then((test)=>{
                            let question_count  = test.getQuestionLen()
                            Promise.all([
                                repo.sumOfCorrectAnswers(new TestTaker(null, test.id, id)),
                                repo.deletedSumOfTest(new TestTaker(null, test.id, id)),
                                repo.getByTestTaker(new TestTaker(null, test.id, id))
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

                }else{
                    let testTakerAnswers = []
                    let start = req.body.data.start
                    for(let i = 0 ; i < req.body.data.answers.length; ++i){
                        let data = req.body.data.answers[i]
                        let diff = Math.abs((new Date(data.time).getTime() - new Date(start).getTime())/1000)
                        testTakerAnswers.push(new TestTakerAnswer(req.body.data.user_id, req.body.data.test_id, data.id, data.q_id, false, start, diff))
                    }

                    if(testTakerAnswers.length)
                        repo.insertOrUpdate(testTakerAnswers).then((result)=>{
                            if(result){
                                res.send({
                                    status  : true,
                                    code    : 0,
                                    message : null
                                })
                            }
                        })
                }
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                });
            }
        })
}