const db        = require("../config/db.js")
const School    = require("../models/school.js")

exports.all = new Promise((resolve, reject)=>{
    db.getConnection((err,connection)=>{
        if(err) throw(err)
        
        let sql = "SELECT * FROM schools";
        connection.query(sql, (err, result)=>{
            if(err) throw(err)
            let tres = [];

            result.array.forEach(element => {
                tres.push(new School(element.id, element.name))
            });

            connection.release()
            return resolve(tres);
        })
    })
});