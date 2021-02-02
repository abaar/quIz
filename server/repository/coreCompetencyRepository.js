const db        = require("../config/db.js")
const CoreCompetency     = require("../models/coreCompetency")


exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM core_competency";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new CoreCompetency(element.id, element.topic_id, element.name, element.description, element.class_id))
                    });
                }
                connection.release()
                return resolve(tres);
            })
        })
    });
}

exports.store = (coreCompetency)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO core_competency(topic_id, class_id, name, description) VALUES(?,?,?,?)";

            connection.query(sql, [coreCompetency.topic_id, coreCompetency.class_id, coreCompetency.name , coreCompetency.description],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.update = (coreCompetency)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "UPDATE core_competency SET topic_id = ?, class_id = ? , name = ?, description = ? WHERE id = ?";

            connection.query(sql, [coreCompetency.topic_id, coreCompetency.class_id, coreCompetency.name , coreCompetency.description, coreCompetency.id],(err, result)=>{
                if(err) {
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

            const sql = `DELETE FROM core_competency WHERE id in (?)`;
            connection.query(sql,[value_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}