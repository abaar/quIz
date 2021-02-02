const db        = require("../config/db.js")
const Topic     = require("../models/topics.js")


exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM topics";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new Topic(element.id, element.name, element.subject_id))
                    });
                }

                connection.release()
                return resolve(tres);
            })
        })
    });
}

exports.store = (topic)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO topics(subject_id, name) VALUES(?,?)";

            connection.query(sql, [topic.subject_id , topic.name],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.update = (topic)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "UPDATE topics SET subject_id = ? , name = ? WHERE id = ?";

            connection.query(sql, [topic.subject_id , topic.name, topic.id],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.destroy = (topic_ids)=>{
    return new Promise((resolve,reject)=>{
        db.getConnection((err,connection)=>{
            if(err) {
                return resolve(false);
            }

            const sql = `DELETE FROM topics WHERE id in (?)`;
            connection.query(sql,[topic_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}