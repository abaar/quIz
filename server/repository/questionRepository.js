const db = require("../config/db");
const Question = require("../models/questions")
const QuestionAnswers   = require("../models/questionAnswers")

exports.getQuestionByTest = (test, id = null) =>{
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

                            connection.release()
                            return resolve(Object.values(question_obj))
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