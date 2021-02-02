const db        = require("../config/db.js")
const User      = require("../models/users.js")
const bcrypt    = require('bcryptjs');

exports.getById = (id) => {
    return new Promise((resolve, reject) =>{
        db.getConnection((err,connection) =>{
            if(err) return resolve(false);
            
            let sql = "SELECT id, name, username from USERS where id = ?";
            connection.query(sql, [id], (err,result)=>{
                if(err) return resolve(false);

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

exports.allUsers = (raw = false) =>{
        return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            
            let sql = "SELECT * FROM USERS";
            connection.query(sql, (err, result)=>{
                if(err) return resolve(false);
                let users = [];
                
                if(raw){
                    users = result
                }else{
                    result.forEach(element => {
                        users.push(new User(element.id, element.name, element.username, null, null, element.active, element.subclass_id, element.class_id, element.school_id , element.userlevel));
                    });
                }
                connection.release()
                return resolve(users);
            })
        })
    });
}

exports.saveUser = (user)=>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) return resolve(false);
            let sql = "INSERT INTO USERS(name, username, password, subclass_id, class_id, school_id) VALUES(?,?,?,?,?,?)";
            bcrypt.hash(user.password,10, (err,hashedPassword)=>{
                if(err){
                    return resolve(false);
                }
                connection.query(sql, [user.name,user.username, hashedPassword, user.subclass_id, user.class_id, user.school_id],(err, result)=>{
                    if(err) {
                        return resolve(false);
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
            if(err) return resolve(false);
        
            let sql = `SELECT * FROM USERS WHERE username = ?`;
            connection.query(sql,[username],(err, result)=>{
                if(err) return resolve(false);
                
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

exports.update = (user, changePassword = false) =>{
    return new Promise((resolve, reject)=>{
        db.getConnection((err,connection)=>{
            if(err) {
                return resolve(false);
            }
            
            if(changePassword){
                const sql = `UPDATE users SET username = ? , name = ? , password = ?, userlevel =? , school_id  =? , class_id = ?, subclass_id = ? WHERE id = ?`;
                bcrypt.hash(user.password,10, (err,hashedPassword)=>{
                    if(err){
                        return resolve(false);
                    }
                    connection.query(sql,[user.username, user.name, hashedPassword, user.userlevel, user.school_id, user.class_id, user.subclass_id, user.id],(err, result)=>{
                        if(err){
                            return resolve(false);
                        }
                        connection.release()
                        return resolve(true);
                    })
                })
            }else{
                const sql = `UPDATE users SET username = ? , name = ?, userlevel =? , school_id  =? , class_id = ?, subclass_id = ? WHERE id = ?`;
                connection.query(sql,[user.username, user.name, user.userlevel, user.school_id, user.class_id, user.subclass_id, user.id],(err, result)=>{
                    if(err) 
                        return resolve(false);
                    
                    connection.release()
                    return resolve(true);
                })
            }
        })
    });
}

exports.destroy = (users_id)=>{
    return new Promise((resolve,reject)=>{
        db.getConnection((err,connection)=>{
            if(err) {
                return resolve(false);
            }

            const sql = `DELETE FROM users  WHERE id in (?)`;
            connection.query(sql,[users_id],(err, result)=>{
                if(err) 
                    return resolve(false);
                
                connection.release()
                return resolve(true);
            })
        })
    })
}