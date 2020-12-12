const path   = require('path')
const repo   = require("../../repository/authRepository.js")
const repoU  = require("../../repository/userRepository.js")
const env    = require("../../config/env")
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

                        let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {algorithm:process.env.JWT_ALGO, expiresIn:parseInt(process.env.JWT_EXPIRE) });
                        let refresh = jwt.sign({username:user.username}, process.env.JWT_REFRESH, {algorithm:process.env.JWT_ALGO, expiresIn:parseInt(process.env.JWT_REFRESH_EXPIRE) });

                        console.log(process.env.JWT_EXPIRE)
                        console.log(process.env.JWT_REFRESH_EXPIRE)
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
                    message : "Username tidak ditemukan!",
                });
            }
        })
    }catch(err){
        console.log(err)
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
            let token = jwt.sign({id:result.id}, process.env.JWT_SECRET, {algorithm:process.env.JWT_ALGO, expiresIn:process.env.JWT_EXPIRE });
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