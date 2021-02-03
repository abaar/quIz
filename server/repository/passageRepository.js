const db        = require("../config/db.js")
const Passage   = require("../models/passages.js")


exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM passages";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new Passage(element.id, element.subject_id, element.name , element.passage))
                    });
                }

                connection.release()
                return resolve(tres);
            })
        })
    });
}

exports.store = (passage)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO passages(passage, subject_id, name) VALUES(?, ?, ?)";

            connection.query(sql, [passage.passage, passage.subject_id, passage.name,],(err, result)=>{
                if(err) {
                    console.log(err)
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.update = (passage)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "UPDATE passages SET passage = ?, subject_id = ?, name = ? WHERE id = ?";

            connection.query(sql, [passage.passage, passage.subject_id, passage.name, passage.id],(err, result)=>{
                if(err) {
                    console.log(err)
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.destroy = (value_ids)=>{
    return new Promise((resolve,reject)=>{
        db.getConnection((err,connection)=>{
            if(err) {
                return resolve(false);
            }

            const sql = `DELETE FROM passages WHERE id in (?)`;
            connection.query(sql,[value_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}