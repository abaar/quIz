const db        = require("../config/db.js")
const Subject   = require("../models/subjects.js")


exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM subjects";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new Subject(element.id, element.name))
                    });
                }

                connection.release()
                return resolve(tres);
            })
        })
    });
}

exports.store = (subject)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO subjects(name) VALUES(?)";

            connection.query(sql, [subject.name],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.update = (subject)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "UPDATE subjects SET name = ? WHERE id = ?";

            connection.query(sql, [subject.name, subject.id],(err, result)=>{
                if(err) {
                    return resolve(false);
                }

                connection.release()
                return resolve(true);
            });

        });
    });
} 

exports.destroy = (matpel_ids)=>{
    return new Promise((resolve,reject)=>{
        db.getConnection((err,connection)=>{
            if(err) {
                return resolve(false);
            }

            const sql = `DELETE FROM subjects WHERE id in (?)`;
            connection.query(sql,[matpel_ids],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}