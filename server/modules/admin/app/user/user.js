const path  = require('path')
const repo  = require("../../../../repository/userRepository.js")
const repoSubclass  = require("../../../../repository/subclassRepository.js")
const repoClass     = require("../../../../repository/classRepository.js")
const repoSchool    = require("../../../../repository/schoolRepository.js")

const School    = require("../../../../models/school.js")
const Class     = require("../../../../models/class.js")
const Subclass  = require("../../../../models/subclass.js")
const User      = require("../../../../models/users.js")

exports.allData = (req, res)=>{
    try{

        Promise.all([
            repo.allUsers(true),
            repoSubclass.all(true),
            repoClass.all(true),
            repoSchool.all(true),
        ]).then((values)=>{

            let users       = values[0]
            let subclasses  = values[1]
            let classes     = values[2]
            let schools     = values[3]

            let subclass_obj    = {}
            let class_obj       = {}
            let school_obj      = {}

            let users_arr       = []

            schools.forEach(element => {
                school_obj[element.id] = new School(element.id, element.name)
            });


            classes.forEach(element => {
                class_obj[element.id] = new Class(element.id, element.school_id , element.name)
            })

            subclasses.forEach(element =>{
                subclass_obj[element.id] = new Subclass(element.id, element.class_id , element.name)

                class_obj[element.class_id].addSubclass(subclass_obj[element.id])
            })

            const key = Object.keys(class_obj)
            for(let i =0 ; i < key.length; ++i ){
                school_obj[class_obj[key[i]].school_id].addClass(class_obj[key[i]])
            }


            users.forEach(element => {
                let hold = new User(element.id, element.name, element.username, null, null, element.active, element.subclass_id, element.class_id, element.school_id , element.userlevel)
                
                if(element.school_id !== null){
                    hold.setSchool(school_obj[element.school_id])
                }

                if(element.class_id !== null){
                    hold.setClass(class_obj[element.class_id])
                }

                if(element.subclass_id !== null){
                    hold.setSubclass(subclass_obj[element.subclass_id])
                }

                users_arr.push(hold);
            });

            res.send({
                status : true,
                data   : {
                    // _subclass : Object.values(subclass_obj),
                    // _class    : Object.values(class_obj),
                    _schools  : Object.values(school_obj),
                    users    : users_arr
                }
            })
        })

    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}

exports.store = (req,res) => {
    const {user} = req.body
    try{

        if(user.username.length < 4){
            res.send({
                status  : false,
                message : "Username minimal harus 4 karakter!"
            }); 

            return
        }

        repo.getByUsername(user.username).then((result)=>{
            if(!result){
                repo.saveUser(new User(null, user.name, user.username, user.username, null, 1, user.subclass_id, user.class_id, user.school_id, user.userlevel)).then((inserted)=>{
                    if(inserted){
                        res.send({
                            status  : true,
                            message : "Berhasil menambahkan data!"
                        })
                    }else{
                        res.send({
                            status  : false,
                            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                        }); 
                    }
                })
            }else{
                res.send({
                    status  : false,
                    message : "Username telah ada dalam database! Mohon gunakan username lainnya!"
                })
            }
        })
        
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        }); 
    }
}

exports.update = (req,res) =>{
    const {user} = req.body
    try{
        if(user.password > 0 && user.password < 6){
            res.send({
                status  : false,
                message : "Apabila ingin merubah password, minimal 6 karakter"
            }); 
            return
        }
        repo.update(new User(user.id, user.name, user.username, user.password, null, 1, user.subclass, user.class ,user.school, user.userlevel), (user.password.length>0)).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menyimpan data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                }); 
            }
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        }); 
    }
}

exports.destroy = (req,res) => {
    const {user_ids } = req.body
    try{
        repo.destroy(user_ids).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menghapus data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
                }); 
            } 
        })
    }catch(err){
        res.send({
            status  : false,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        }); 
    }
}