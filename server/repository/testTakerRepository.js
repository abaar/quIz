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

exports.createIfNotExist = (testtaker, data, type) =>{
    return new Promise((resolve,reject) => {
        try{
            let create = true
            if(type === 0){
                db.getConnection((err, connection) => {
                    let sql = "SELECT * FROM test_takers WHERE test_id = ? AND user_id = ?"
                    connection.query(sql, [data.test_id, data.user_id], (err, result)=>{
                        if(err)
                            return resolve(false)
                        
                        if(result)
                            create = false
                    })
                    connection.release()
                });
            }

            if(create){
                db.getConnection((err,connection)=>{
                    let sql = "INSERT INTO test_takers(test_id, user_id, start, end, score) VALUES (?,?,?,?,?)"
                    connection.query(sql, [testtaker.test_id , testtaker.user_id, testtaker.start, testtaker.end, testtaker.score], (err,result)=>{
                        if(err)
                        return resolve(false)
                        
                        connection.release()
                        return resolve(true)
                    })
                })
            }
        }catch(err){
            throw err
        }
    })
}