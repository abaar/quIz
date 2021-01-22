const db        = require("../config/db.js")
const Test      = require("../models/tests.js");
const TestTaker = require("../models/testTakers.js");

exports.getById = (id, withQuestionId = false) => {
    return new Promise((resolve, reject) =>{
        db.getConnection((err,connection) =>{
            if(err) throw err;

            let sql;
            if(withQuestionId){
                sql = "SELECT tests.*, question_id FROM tests LEFT JOIN test_questions ON tests.id = test_questions.test_id WHERE tests.id = ?";
            }
            else{
                sql = "SELECT * from TESTS where id = ?";
            }
            connection.query(sql, [id], (err,result)=>{
                if(err) throw(err)

                if(result.length == 0){
                    return resolve(false);
                }

                let test;
                if(withQuestionId){
                    res = result[0]
                    test = new Test(res.id, res.code, res.type, res.title, res.description, res.topic_id, res.subject_id, res.date, res.start, res.end, res.algorithm_id, res.user_id, res.subclass_id, res.class_id, res.school_id, res.randomquestion, res.randomanswers);
                    for(let i =0 ; i < result.length ; ++i){
                        test.addQuestionId(result[i].question_id)
                    }
                }else{
                    result = result[0]
                    test = new Test(result.id, result.code, result.type, result.title, result.description, result.topic_id, result.subject_id, result.date, result.start, result.end, result.algorithm_id, result.user_id, result.subclass_id, result.class_id, result.school_id, result.randomquestion, result.randomanswers);
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
                    return resolve(false);
                }
                result = result[0]
                let test = new Test(result.id, result.code, result.type, result.title, result.description, result.topic_id, result.subject_id, result.date, result.start, result.end, result.algorithm_id, result.user_id, result.subclass_id, result.class_id, result.school_id, result.randomquestion, result.randomanswers);
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
                
                let sql = "SELECT tests.* , test_takers.start as tstart , test_takers.end as tend, test_takers.score as tscore FROM tests LEFT JOIN test_takers on tests.id = test_takers.test_id WHERE (date >= curdate() and (tests.user_id = ? or (subclass_id is not null and subclass_id = ?) or (class_id is not null and class_id = ?) or (school_id is not null and school_id = ?))) or (date is null)";
                try{
                    connection.query(sql, [user.id, user.subclass_id , user.class_id , user.school_id], (err,result)=>{
                        if(err) throw(err)
                        
                        if(!result){
                            result = []
                        }
                        holder = []
                        for( let i = 0 ; i < result.length ; ++i){
                            let test = new Test(result[i].id, result[i].code, result[i].type, result[i].title, result[i].description, result[i].topic_id, result[i].subject_id, result[i].date, result[i].start, result[i].end, result[i].algorithm_id, result[i].user_id, result[i].subclass_id, result[i].class_id, result[i].school_id, result[i].randomquestion, result[i].randomanswers);
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

                let sql = "SELECT * FROM test_questions WHERE test_id = ?"
                connection.query(sql, [id], (err, result)=>{
                    if(!result){
                        result = []
                    }

                    holder = []

                    for( let i = 0 ; i < result.length ; ++i){
                        holder.push(result[i])
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