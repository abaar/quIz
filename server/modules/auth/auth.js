const path   = require('path')
const repo   = require("../../repository/authRepository.js")
const repoU  = require("../../repository/userRepository.js")
const bcrypt = require("bcryptjs")
const jwt    = require("jsonwebtoken")
const User   = require("../../models/users.js")

exports.attempt = (req, res)=>{
    try{
        let username        = req.body.username
        let plainPassword   = req.body.password
        repo.getByUsername(username).then((user)=>{
            if(user){
                let hashedPassword  = user.password
                bcrypt.compare(plainPassword,hashedPassword).then((result)=>{
                    if(result){

                        let token = jwt.sign({id:user.id, subclass_id:user.subclass_id, class_id:user.class_id, school_id:user.school_id, active:user.active}, process.env.JWT_SECRET, {algorithm:process.env.JWT_ALGO, expiresIn:parseInt(process.env.JWT_EXPIRE) });
                        let refresh = jwt.sign({username:user.username}, process.env.JWT_REFRESH, {algorithm:process.env.JWT_ALGO, expiresIn:parseInt(process.env.JWT_REFRESH_EXPIRE) });

                        res.cookie('token', refresh,{
                            expires     : new Date(Date.now() + process.env.JWT_REFRESH_EXPIRE),
                            secure      : false,
                            httpOnly    : true,
                        })
                        res.send({
                            status  : true,
                            data    : new User(user.id, user.name, user.username, null, token),
                        });
                    }else{
                        res.send({
                            status  : false,
                            message : "Username / Pasword salah!",
                        });
                    }
                })
            }else{
                res.send({
                    status  : false,
                    message : "Username tidak ditemukan x!",
                });
            }
        })
    }catch(err){
    }
}

exports.logout = (req, res) =>{
    res.cookie('token', "",{
        expires     : new Date(),
        secure      : false,
        httpOnly    : true,
    })
    res.send({
        status  : true,
        data    : null,
    });
}

exports.refresh = (req, res) =>{
    repoU.getByUsername(req.user.username).then((result)=>{
        if(result){
            let token = jwt.sign({
                id:result.id,
                subclass_id:result.subclass_id, 
                class_id:result.class_id,
                school_id:result.school_id,
                active:result.active
            }, process.env.JWT_SECRET, {algorithm:process.env.JWT_ALGO, expiresIn:parseInt(process.env.JWT_EXPIRE) });
            res.send({
                status  : true,
                data    : new User(result.id, result.name, result.username,null, token),
            });
        }else{
            res.send({
                status: false,
                data : null,
            }); 
        }
    });
}