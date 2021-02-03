const db        = require("../config/db.js")
const SpecificCompetency     = require("../models/specificCompetency.js")

exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM specific_competency";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new SpecificCompetency(element.id, element.base_id, element.description))
                    });
                }
                connection.release()
                return resolve(tres);
            })
        })
    });
}

exports.store = (specificCompetency)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO specific_competency(base_id, description) VALUES(?,?)";

            connection.query(sql, [specificCompetency.base_id, specificCompetency.description],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.update = (specificCompetency)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "UPDATE specific_competency SET base_id = ?, description = ? WHERE id = ?";

            connection.query(sql, [specificCompetency.base_id, specificCompetency.description, specificCompetency.id],(err, result)=>{
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

            const sql = `DELETE FROM specific_competency WHERE id in (?)`;
            connection.query(sql,[value_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}