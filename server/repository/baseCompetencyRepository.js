const db        = require("../config/db.js")
const BaseCompetency     = require("../models/baseCompetency.js")

exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM base_competency";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new BaseCompetency(element.id, element.code_id, element.description))
                    });
                }
                connection.release()
                return resolve(tres);
            })
        })
    });
}

exports.store = (baseCompetency)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO base_competency(core_id, description) VALUES(?,?)";

            connection.query(sql, [baseCompetency.core_id, baseCompetency.description],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.update = (baseCompetency)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "UPDATE base_competency SET core_id = ?, description = ? WHERE id = ?";

            connection.query(sql, [baseCompetency.core_id, baseCompetency.description, baseCompetency.id],(err, result)=>{
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

            const sql = `DELETE FROM base_competency WHERE id in (?)`;
            connection.query(sql,[value_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}