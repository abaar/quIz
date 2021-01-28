const db        = require("../config/db.js")
const Test      = require("../models/tests.js");
const TestTakerAnswer = require("../models/testTakerAnswers.js");

exports.insertOrUpdate = (testTakerAnswers) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err, conn)=>{
            const sql = "REPLACE INTO test_taker_answers (user_id, test_id, answers_id, question_id, time_needed_in_seconds) VALUES (?)"
            let datas = []
            for(let i = 0; i < testTakerAnswers.length ; ++i){
                datas.push([testTakerAnswers[i].user_id, testTakerAnswers[i].test_id, testTakerAnswers[i].answers_id, testTakerAnswers[i].question_id, testTakerAnswers[i].time_needed_in_seconds ])
            }

            conn.query(sql, datas, (err, res)=>{
                if(err)
                    throw err

                conn.release()
                return resolve(true)
            })
        })
    })
}

exports.getByTestTaker = (testtaker) =>{
    return new Promise ((resolve, reject) =>{
        db.getConnection((err,conn) => {
            const sql = "SELECT * FROM test_taker_answers WHERE user_id = ? AND test_id = ?"

            conn.query(sql, [testtaker.user_id, testtaker.test_id], (err,res) => {
                if(err)
                    throw(err)

                let finalresult = []

                for(let i =0 ; i < res.length ; ++i){
                    finalresult.push(new TestTakerAnswer(res[i].user_id, res[i].test_id, res[i].answers_id, res[i].question_id, res[i].is_correct, res[i].timestamps, res[i].time_needed_in_seconds))
                }
                
                conn.release()
                return resolve(res)
            })
        })
    })
}

exports.sumOfCorrectAnswers = (testtaker) => {
    return new Promise ((resolve, reject) =>{
        db.getConnection((err,conn) => {
            const sql = "SELECT user_id, test_id, sum(is_correct) as correct_total FROM test_taker_answers WHERE user_id = ? AND test_id = ? GROUP BY (test_id) LIMIT 1"

            conn.query(sql, [testtaker.user_id, testtaker.test_id], (err,res) => {
                if(err)
                    throw(err)

                if(res.length > 0)
                    res = res[0]
                
                conn.release()
                return resolve(res)
            })
        })
    })
}

exports.deletedSumOfTest = (testtaker) =>{
    return new Promise((resolve, reject) =>{
        db.getConnection((err, conn)=>{
            const sql = "SELECT user_id, test_id, question_id , SUM(time_needed_in_seconds) AS time_total FROM test_taker_answers_deleted WHERE user_id = ? AND test_id = ? GROUP BY (question_id)"
            
            conn.query(sql, [testtaker.user_id , testtaker.test_id], (err, res)=>{
                if(err)
                    throw(err)
                
                let finalresult = {}

                for(let i =0; i < res.length ; ++i){
                    finalresult[res[i].question_id] = res[i].time_total
                }

                return resolve(finalresult)
                conn.release()
            })
        })
    })
}