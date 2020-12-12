const db        = require("../config/db.js")
const User      = require("../models/users.js")
const bcrypt    = require('bcryptjs');
const env       = require("../config/env.js")

exports.getByUsername = (username) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) throw(err)
            
            let sql = `SELECT * FROM USERS WHERE username = ?`;
            connection.query(sql,[username],(err, result)=>{
                if(err) throw(err)

                if(result.length == 0){
                    return resolve(false);
                }
                result = result[0]
                let users = new User(result.id, result.name , result.username, result.password, result.token);
                connection.release()
                return resolve(users);
            })
        })
    });
}