const db = require("../config/db");
const { connect } = require("../modules/quiz/routes/tests");



exports.create = (testtaker) =>{
    return new Promise((resolve,reject) => {
        try{
            db.getConnection((err,connection)=>{
                let sql = "INSERT INTO test_takers(test_id, user_id, start, end, score) VALUES (?,?,?,?,?)"
                connection.query(sql, [testtaker.test_id , testtaker.user_id, testtaker.start, testtaker.end, testtaker.score], (err,result)=>{
                    if(err)
                        return resolve(false)

                    connection.release()
                    return resolve(true)
                })
            })
        }catch(err){
            throw err
        }
    })
}

exports.update = (testtaker) => {
    return new Promise((resolve,reject) => {
        try{
            db.getConnection((err,connection)=>{
                let sql = "UPDATE test_takers set test_id = ?, user_id = ?, start = ?, end = ?, score = ?"
                connection.query(sql, [testtaker.test_id , testtaker.user_id, testtaker.start, testtaker.end, testtaker.score], (err,result)=>{
                    if(err)
                        return resolve(false)

                    connection.release()
                    return resolve(true)
                })
            })
        }catch(err){
            throw err
        }
    })
}

exports.finish = (testtaker, testTakerAnswers, scores)=>{
    return new Promise((resolve, reject) => {
        db.getConnection((err,conn) =>{
            conn.beginTransaction((err)=>{
                if(err){
                    throw err
                }

                const updatetest = "UPDATE test_takers set end = ?, score = ? WHERE test_id = ? AND user_id = ?"
                conn.query(updatetest, [new Date(), scores ,testtaker.test_id , testtaker.user_id], (err,result)=>{
                    if(err){
                        return conn.rollback(() => {
                            conn.release()
                            return resolve(false)
                        });
                    }

                    const replace = "REPLACE INTO test_taker_answers (user_id, test_id, answers_id, question_id, time_needed_in_seconds, timestamps, is_correct) VALUES (?)"
                    let datas = []
                    for(let i = 0; i < testTakerAnswers.length ; ++i){
                        datas.push([testTakerAnswers[i].user_id, testTakerAnswers[i].test_id, testTakerAnswers[i].answers_id, testTakerAnswers[i].question_id, testTakerAnswers[i].time_needed_in_seconds, testTakerAnswers[i].timestamps, testTakerAnswers[i].is_correct ])
                    }
        
                    conn.query(replace, datas, (err, res)=>{
                        if(err){
                            return conn.rollback(() => {
                                conn.release()
                                return resolve(false)
                            });
                        }

                        const deleteDeletedAnswers = "DELETE FROM test_taker_answers_deleted WHERE user_id = ? AND test_id = ?"
                        conn.query(deleteDeletedAnswers, [testtaker.user_id, testtaker.test_id], (err, res)=>{
                            if(err){
                                return conn.rollback(() => {
                                    conn.release()
                                    return resolve(false)
                                });
                            }

                            conn.commit((err) => {
                                if (err) {
                                  return conn.rollback(() => {
                                    conn.release()
                                    return resolve(false)
                                  });
                                }
                                conn.release()
                                return resolve(true)
                            })
                        })
                        // end of delete
                    })
                    // end of replace answers with updated time needed
                })
                // end of testtaker score update

            })
        })
    })
}

exports.createIfNotExist = (testtaker, data, type) =>{
    return new Promise((resolve,reject) => {
        try{
            let create = true
            let update = false
            let test_takers = null
            db.getConnection((err, connection) => {
                let sql = "SELECT * FROM test_takers WHERE test_id = ? AND user_id = ?"
                connection.query(sql, [data.test_id, data.user_id], (err, result)=>{
                    if(err){
                        connection.release()
                        return resolve(false)
                    }

                    if( result.length !== 0 && type === 0){
                        update      = true
                        test_takers = result[0] 
                        create      = false
                    }

                    if(update){
                        let sql = "UPDATE test_takers SET start = ? WHERE id = ?"
                        connection.query(sql, [testtaker.start, test_takers.id ], (err,result)=>{
                            if(err){
                                resolve(false)
                            }else{
                                resolve(true)
                            }
                        })
                    }
                    else if(create){
                        let sql = "INSERT INTO test_takers(test_id, user_id, start, end, score) VALUES (?,?,?,?,?)"
                        connection.query(sql, [testtaker.test_id , testtaker.user_id, testtaker.start, testtaker.end, testtaker.score], (err,result)=>{
                            if(err){
                                resolve(false)
                            }
                            else{
                                resolve(true)
                            }
                        })
                    }
                    connection.release()
                })

            });

        }catch(err){
            connection.release()
        }
    })
}