const db        = require("../config/db.js")
const Class  = require("../models/class.js")

exports.all = (raw = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) throw(err)
            
            let sql = "SELECT * FROM classes";
            connection.query(sql, (err, result)=>{
                if(err) throw(err)
                let tres = [];

                if(raw){
                    tres = result
                }else{
                    result.forEach(element => {
                        tres.push(new Class(element.id, element.school_id, element.name))
                    });
                }

                connection.release()
                return resolve(tres);
            })
        })
    });
}