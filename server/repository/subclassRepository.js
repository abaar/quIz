const db        = require("../config/db.js")
const Subclass  = require("../models/subclass.js")

exports.all = new Promise((resolve, reject)=>{
    db.getConnection((err,connection)=>{
        if(err) throw(err)
        
        let sql = "SELECT * FROM subclasses";
        connection.query(sql, (err, result)=>{
            if(err) throw(err)
            let subclass = [];

            result.array.forEach(element => {
                subclass.push(new Subclass(element.id , element.class_id, element.name))
            });

            connection.release()
            return resolve(subclass);
        })
    })
});