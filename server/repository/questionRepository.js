const db = require("../config/db");
const Question = require("../models/questions")
const QuestionAnswers   = require("../models/questionAnswers");
const QuestionSpecificCompetency = require("../models/questionSpecificCompetencies");


exports.all = (raw = false) =>{
    return new Promise((resolve, reject) =>{
        db.getConnection((err,connection) => {
            sql = "SELECT q.id AS id, q.passage_id as passage_id, q.path_image as path_image, q.is_katex as is_katex, q.true_count as true_count, q.false_count as false_count, q.question AS question , qa.id AS answer_id, qa.label AS answer_label, qa.is_correct as answer_correct FROM questions q INNER JOIN question_answers qa ON q.id = qa.question_id"
            connection.query(sql, (err,result)=>{
                if(err){
                    console.log(err)
                    return resolve(false)
                }
                
                if(result){
                    const question_obj = {}
                    const question_ids = []
                    for(let i =0 ; i < result.length ; ++i){
                        if ( question_obj[result[i].id] === undefined ){
                            question_obj[result[i].id] = new Question(result[i].id, result[i].question, result[i].true_count, result[i].false_count, null, result[i].passage_id, result[i].path_image, result[i].is_katex)
                            question_ids.push(result[i].id)
                        }

                        question_obj[result[i].id].addAnswer(new QuestionAnswers(result[i].answer_id, result[i].id, result[i].answer_label, result[i].answer_correct))
                    }

                    sql = "SELECT id, question_id, specific_id FROM question_specific_competencies WHERE id in (?)"
                    connection.query(sql , [question_ids], (err,result)=>{
                        for(let i =0 ; i < result.length; ++i){
                            const qspecific = new QuestionSpecificCompetency(result[i].id, result[i].question_id , result[i].specific_id)
                            question_obj[result[i].question_id].addSpecificCompetency(qspecific)
                        }

                        resolve(Object.values(question_obj))
                        connection.release()
                    })
                }else{
                    resolve([])
                }
            })
        })
    })
}

exports.store = (questions) => {
    return new Promise((resolve,reject) => {
        try{
            db.getConnection((err,connection) => {
                if(err){
                    console.log(err)
                    return resolve(false)
                }

                connection.beginTransaction((err)=>{
                    const sql = "INSERT INTO questions(question, is_katex, passage_id, path_image) values(?,?,?,?)"
                    connection.query(sql, [questions.question, questions.is_katex, questions.passage_id, questions.path_image], (err,results)=>{
                        if(err){
                            return connection.rollback(() => {
                                return reject(false)
                            });
                        }

                        const question_id = results.insertId
                        const answers = []
                        const specific = []
                        
                        for(let i =0 ; i < questions.answers.length; ++i){
                            answers.push([question_id, questions.answers[i].label, questions.answers[i].is_correct])
                        }

                        for(let i =0 ; i < questions.specificCompetencies.length; ++i){
                            specific.push([question_id, questions.specificCompetencies[i].specific_id])
                        }


                        if(specific.length === 0){
                            const sql = "INSERT INTO question_answers(question_id, label, is_correct) VALUES ?"
                            connection.query(sql, [answers], (err,result)=>{
                                console.log(err)
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
                        }else{
                            const sql = "INSERT INTO question_answers(question_id, label, is_correct) VALUES ?"
                            connection.query(sql, [answers], (err,result)=>{
                                const sql = "INSERT INTO question_specific_competencies(question_id, specific_id) VALUES ?"
                                connection.query(sql, [specific], (err,result)=>{
                                    console.log(err)
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
                        }

                    })
                })
            })
        }catch(err){

        }
    })
}

exports.update = (questions) =>{
    return new Promise((resolve,reject) => {
        try{
            db.getConnection((err,connection) => {
                if(err){
                    console.log(err)
                    return resolve(false)
                }

                connection.beginTransaction((err)=>{
                    const sql = "REPLACE INTO questions(id, question, is_katex, passage_id, path_image) values(?,?,?,?,?)"
                    connection.query(sql, [ questions.id ,questions.question, questions.is_katex, questions.passage_id, questions.path_image], (err,results)=>{
                        if(err){
                            console.log(err)
                            return connection.rollback(() => {
                                return reject(false)
                            });
                        }

                        const question_id = questions.id
                        const answers = []
                        const specific = []
                        
                        for(let i =0 ; i < questions.answers.length; ++i){
                            answers.push([question_id, questions.answers[i].label, questions.answers[i].is_correct])
                        }

                        for(let i =0 ; i < questions.specificCompetencies.length; ++i){
                            specific.push([question_id, questions.specificCompetencies[i].specific_id])
                        }


                        if(specific.length === 0){
                            const sql = "INSERT INTO question_answers(question_id, label, is_correct) VALUES ?"
                            connection.query(sql, [answers], (err,result)=>{
                                console.log(err)
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
                        }else{
                            const sql = "INSERT INTO question_answers(question_id, label, is_correct) VALUES ?"
                            connection.query(sql, [answers], (err,result)=>{
                                const sql = "INSERT INTO question_specific_competencies(question_id, specific_id) VALUES ?"
                                connection.query(sql, [specific], (err,result)=>{
                                    console.log(err)
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
                        }

                    })
                })
            })
        }catch(err){

        }
    })
}

exports.destroy = (value_ids)=>{
    return new Promise((resolve,reject)=>{
        db.getConnection((err,connection)=>{
            if(err) {
                return resolve(false);
            }

            const sql = `DELETE FROM questions WHERE id in (?)`;
            connection.query(sql,[value_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}

exports.getQuestionByTest = (test, id = null, specific=false) =>{
    return new Promise((resolve,reject) => {
        try{
            db.getConnection((err,connection)=>{

                let testQuestion = test.question_ids

                question_obj = {}
                if(testQuestion.length){
                    let sql ;
                    if(id !== null ){
                        sql = "SELECT q.id AS id, q.question AS question , qa.id AS answer_id, qa.label AS answer_label, tta.answers_id AS testtaker_answer , tta.question_id AS testaker_question FROM questions q INNER JOIN question_answers qa ON q.id = qa.question_id LEFT JOIN test_taker_answers AS tta ON qa.id = tta.answers_id AND qa.question_id = tta.question_id AND tta.user_id = ?  AND tta.test_id = ?  WHERE  q.id IN (?)"
                        connection.query(sql, [id,test.id,testQuestion], (err,result)=>{
                            if(err)
                                throw(err)
                            if(!result)
                                result = []

                            for(let i =0 ; i < result.length ; ++i){
                                if ( question_obj[result[i].id] === undefined ){
                                    question_obj[result[i].id] = new Question(result[i].id, result[i].question, 0, 0)
                                }

                                question_obj[result[i].id].addAnswer(new QuestionAnswers(result[i].answer_id, result[i].id, result[i].answer_label,null))

                                if(result[i].testtaker_answer !== null){
                                    question_obj[result[i].id].test_taker_answer = result[i].testtaker_answer
                                }

                            }

                            connection.release()
                            return resolve(Object.values(question_obj))
                        })
                    }else{
                        sql = "SELECT q.id as id, q.question as question , qa.id as answer_id, qa.label as answer_label FROM questions q INNER JOIN question_answers qa ON q.id = qa.question_id WHERE q.id in (?)"
                        connection.query(sql, [testQuestion], (err,result)=>{
                            if(err)
                                throw(err)
                            if(!result)
                                result = []

                            for(let i =0 ; i < result.length ; ++i){
                                if ( question_obj[result[i].id] === undefined ){
                                    question_obj[result[i].id] = new Question(result[i].id, result[i].question)
                                }
                                question_obj[result[i].id].addAnswer(new QuestionAnswers(result[i].answer_id, result[i].id, result[i].answer_label,null))
                            }

                            if(specific){

                                sql = "SELECT id, question_id, specific_id FROM question_specific_competencies WHERE id in (?)"
                                connection.query(sql , [testQuestion], (err,result)=>{
                                    for(let i =0 ; i < result.length; ++i){
                                        const qspecific = new QuestionSpecificCompetency(result[i].id, result[i].question_id , result[i].specific_id)
                                        question_obj[result[i].question_id].addSpecificCompetency(qspecific)
                                    }
                                    connection.release()
                                    return resolve(Object.values(question_obj))
                                })
                            }else{
                                connection.release()
                                return resolve(Object.values(question_obj))
                            }
                        })
                    }
                }else{
                    return resolve(Object.values(question_obj))
                }

            })
        }catch(err){
            throw err
        }
    })
}