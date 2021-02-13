const db        = require("../config/db.js")
const Test      = require("../models/tests.js");
const TestTaker = require("../models/testTakers.js");


const testRepository = {
    all : () =>{
        return new Promise((resolve, reject) => {
            db.getConnection((err,connection) => {
                if(err){
                    console.log(err)
                    return resolve(false)
                }
    
                const sql = "SELECT * FROM tests"
                connection.query(sql, (err,result) => {
                    if(err){
                        console.log(err)
                        return resolve(false)
                    }
    
                    const res = []
                    result.forEach(element => {
                        res.push(new Test(element.id, element.code, element.type, element.title, element.description, element.topic_id, element.subject_id, element.date, element.start, element.end, element.treshold_code, element.subclass_id, element.class_id, element.school_id, element.randomquestion, element.randomanswers))
                    });
    
                    connection.release()
                    return resolve(res)
                })
            })
        })
    },
    store : (test) => {
        return new Promise((resolve,reject) =>{
            db.getConnection((err,connection) => {
                if(err){
                    console.log(err)
                    return resolve(false)
                }
    
                var codeExist = true
    
                    let code           = '';
                    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let charactersLength = characters.length;
                    for ( let i = 0; i < 5; i++ ) {
                        code += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    const sql = "SELECT code FROM tests WHERE code = ?"
                    connection.query(sql, [code], (err,result)=>{
                        if(err){
                            console.log(err)
                            resolve(false)
                        }
    
                        if(result.length === 0){
                            codeExist = false
                            const sql = "INSERT INTO tests(title, type, code, description, topic_id, subject_id, date, start, end, treshold_code, subclass_id, class_id, school_id, randomquestion, randomanswers) VALUE (?)"
    
                            connection.query(sql, [[test.title, test.type, code, test.description, test.topic_id, test.subject_id, test.date, test.start, test.end, test.treshold_code, test.subclass_id, test.class_id, test.school_id, test.randomquestion, test.randomanswers]], (err,result) => {
                                if(err){
                                    console.log(err)
                                    resolve(false)
                                }
    
                                resolve(true)
                            })
                        }else{
                            return testRepository.store(test)
                        }
                    connection.release()
                })
            })
        })
    },
    update : (test) =>{
        return new Promise((resolve,reject)=>{
            db.getConnection((err, connection) => {
                if(err){
                    console.log(err)
                    return resolve(false)
                }

                const sql = "UPDATE tests set title = ?, type = ?, description = ?, topic_id =?, subject_id =? , date =? , start = ? , end =? , treshold_code = ? , subclass_id = ? , class_id =? , school_id =? , randomquestion =? , randomanswers =? WHERE id =?"
                connection.query(sql, [test.title, test.type , test.description , test.topic_id , test.subject_id , test.date, test.start, test.end, test.treshold_code, test.subclass_id, test.class_id , test.school_id, test.randomquestion, test.randomanswers, test.id], (err,result)=>{
                    if(err){
                        console.log(err)
                        return resolve(false)
                    }

                    connection.release()
                    return resolve(true)
                })
            })
        })
    },
    insertQuestion : (test_id, questions_id ) =>{
        return new Promise((resolve,reject)=>{
            db.getConnection((err,connection) => {
                if(err){
                    console.log(err)
                    return resolve(false)
                }

                connection.beginTransaction((err)=>{
                    if(err){
                        console.log(err)
                        return connection.rollback(() => {
                            return reject(false)
                        });
                    }
                    // delete first
                    const sql = "DELETE FROM test_questions where test_id = ?"
                    connection.query(sql, [test_id], (err, result)=>{
                        if(err){
                            console.log(err)
                            return connection.rollback(() => {
                                return reject(false)
                            });
                        }

                        const new_questions = []
                        questions_id.forEach(element => {
                            new_questions.push([test_id, element])
                        })

                        console.log(new_questions)

                        if(new_questions.length === 0){
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        return reject(false)
                                    });
                                }
                                connection.release()
                                return resolve(true)
                            })
                        }

                        const sql = "INSERT INTO test_questions(test_id, question_id) VALUES ?"
                        connection.query(sql, [new_questions], (err,result)=>{
                            if(err){
                                console.log(err)
                                return connection.rollback(() => {
                                    return reject(false)
                                });
                            }

                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        return reject(false)
                                    });
                                }
                                connection.release()
                                return resolve(true)
                            })
                        })
                    })
                })
            })
        })
    },
    destroy : (value_ids) => {
        return new Promise((resolve,reject)=>{
            db.getConnection((err,connection)=>{
                if(err) {
                    return resolve(false);
                }
    
                const sql = `DELETE FROM tests WHERE id in (?)`;
                connection.query(sql,[value_ids],(err, result)=>{
                    if(err) 
                        return resolve(false);
                    
                    connection.release()
                    return resolve(true);
                })
            })
        })
    }
}

exports.all     = testRepository.all
exports.store   = testRepository.store
exports.update  = testRepository.update
exports.insertQuestion = testRepository.insertQuestion
exports.destroy  = testRepository.destroy

exports.getById = (id, withQuestionId = false, withTestTaker = false) => {
    return new Promise((resolve, reject) =>{
        db.getConnection((err,connection) =>{
            if(err) throw err;

            let sql;
            if(withQuestionId === true && withTestTaker  === true){
                sql = "SELECT tests.*, test_takers.start as tstart, test_takers.end as tend, test_takers.score as tscore , question_id FROM tests LEFT JOIN test_takers ON test_takers.test_id = tests.id LEFT JOIN test_questions ON tests.id = test_questions.test_id WHERE tests.id = ?";
            }
            else if(withQuestionId === true && withTestTaker  === false){
                sql = "SELECT tests.*, question_id FROM tests LEFT JOIN test_questions ON tests.id = test_questions.test_id WHERE tests.id = ?";
            }
            else if(withQuestionId === false && withTestTaker === true){
                sql = "SELECT tests.*, test_takers.start as tstart, test_takers.end as tend, test_takers.score as tscore FROM tests LEFT JOIN test_takers ON test_takers.test_id = tests.id WHERE tests.id = ?";
            }
            else if(withQuestionId  === false && withTestTaker  === false){
                sql = "SELECT * from TESTS where id = ?";
            }

            connection.query(sql, [id], (err,result)=>{
                if(err) throw(err)

                if(result.length == 0){
                    connection.release()
                    return resolve(false);
                }

                let test;

                res = result[0]
                test = new Test(res.id, res.code, res.type, res.title, res.description, res.topic_id, res.subject_id, res.date, res.start, res.end, res.treshold_code, res.subclass_id, res.class_id, res.school_id, res.randomquestion, res.randomanswers);
                
                if(withQuestionId){
                    for(let i =0 ; i < result.length ; ++i){
                        test.addQuestionId(result[i].question_id)
                    }
                }

                if(withTestTaker){
                    test.addTaker(new TestTaker(null, test.id, id, res.tstart, res.tend, res.tscore))
                }
                
                connection.release()
                return resolve(test);
            });
        });
    });
}

exports.getByCode = (code) =>{
    return new Promise((resolve, reject) =>{
        db.getConnection((err,connection) =>{
            if(err) throw err;
            
            let sql = "SELECT * from TESTS where code = ?";
            connection.query(sql, [code], (err,result)=>{
                if(err) throw(err)

                if(result.length == 0){
                    connection.release()
                    return resolve(false);
                }
                result = result[0]
                let test = new Test(result.id, result.code, result.type, result.title, result.description, result.topic_id, result.subject_id, result.date, result.start, result.end, result.treshold_code, result.subclass_id, result.class_id, result.school_id, result.randomquestion, result.randomanswers);
                connection.release()
                return resolve(test);
            });
        });
    });
}

exports.getByUser = (user) => {
    return new Promise((resolve, reject) =>{
        try{
            db.getConnection((err,connection) =>{
                if(err) throw err;
                let sql = "SELECT tests.* , test_takers.start as tstart , test_takers.end as tend, test_takers.score as tscore FROM tests LEFT JOIN test_takers on tests.id = test_takers.test_id  AND test_takers.user_id = ? WHERE (date >= curdate() and (test_takers.user_id = ? OR (subclass_id is not null and subclass_id = ?) or (class_id is not null and class_id = ?) or (school_id is not null and school_id = ?))) or (date is null)  ORDER BY tests.type ASC, !ISNULL(tend)";
                try{
                    connection.query(sql, [user.id , user.id, user.subclass_id , user.class_id , user.school_id], (err,result)=>{
                        if(err) throw(err)
                        
                        if(!result){
                            result = []
                        }
                        holder = []
                        for( let i = 0 ; i < result.length ; ++i){
                            let test = new Test(result[i].id, result[i].code, result[i].type, result[i].title, result[i].description, result[i].topic_id, result[i].subject_id, result[i].date, result[i].start, result[i].end, result[i].treshold_code, result[i].subclass_id, result[i].class_id, result[i].school_id, result[i].randomquestion, result[i].randomanswers);
                            let test_takers = new TestTaker(null, result[i].id, user.id, result[i].tstart, result[i].tend, result[i].tscore)
                            if(result[i].tstart !== null){
                                test.addTaker(test_takers)
                            }
                            holder.push(test)
                        }
                        connection.release()
                        return resolve(holder);
                    });
                }catch(err){
                    throw err;
                }
            });
        }catch(err){
            throw(err)
        }
    });
}

exports.getQuestionIds = (id) => {
    return new Promise((resolve, reject)=> {
        try{
            db.getConnection((err,connection) => {
                if(err){
                    throw err
                }

                let sql = "SELECT question_id FROM test_questions WHERE test_id = ?"
                connection.query(sql, [id], (err, result)=>{
                    if(!result){
                        result = []
                    }

                    holder = []

                    for( let i = 0 ; i < result.length ; ++i){
                        holder.push(result[i].question_id)
                    }
                    connection.release()
                    return resolve(holder);
                })
            })
        }catch(err){
            throw err
        }
    })
}