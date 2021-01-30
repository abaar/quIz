const db        = require("../config/db.js")
const User      = require("../models/users.js")
const bcrypt    = require('bcryptjs');

exports.getById = (id) => {
    return new Promise((resolve, reject) =>{
        db.getConnection((err,connection) =>{
            if(err) throw err;
            
            let sql = "SELECT id, name, username from USERS where id = ?";
            connection.query(sql, [id], (err,result)=>{
                if(err) throw(err)

                if(result.length == 0){
                    return resolve(false);
                }
                result = result[0]
                let users = new User(result.id, result.name , result.username, result.password, result.token);
                connection.release()
                return resolve(users);
            });
        });
    });
}

exports.allUsers = new Promise((resolve, reject)=>{
    db.getConnection((err,connection)=>{
        if(err) throw(err)
        
        let sql = "SELECT * FROM USERS";
        connection.query(sql, (err, result)=>{
            if(err) throw(err)
            let users = [];
            result.forEach(element => {
                users.push(new User(element.id, element.name));
            });
            connection.release()
            return resolve(users);
        })
    })
});

exports.saveUser = (user)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) throw(err);
            let sql = "INSERT INTO USERS(name, username, password, subclass_id, class_id, school_id) VALUES(?,?,?,?,?,?)";
            bcrypt.hash(user.password,10, (err,hashedPassword)=>{
                if(err){
                    throw(err)
                }
                connection.query(sql, [user.name,user.username, hashedPassword, user.subclass_id, user.class_id, user.school_id],(err, result)=>{
                    if(err) {
                        throw(err)
                    }
                    connection.release()
                    return resolve(true);
                });
            });
        });
    });
} 

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
                let users = new User(result.id, result.name , result.username, result.password, result.token, result.active, result.subclass_id, result.class_id, result.school_id, result.userlevel);
                connection.release()
                return resolve(users);
            })
        })
    });
}