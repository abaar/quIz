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
                let school = new School(school_obj[element.school_id].id , school_obj[element.school_id].name)
                class_obj[element.id].setSchool(school)

                school_obj[element.school_id].addClass(class_obj[element.id])
            })

            subclasses.forEach(element =>{
                subclass_obj[element.id] = new Subclass(element.id, element.class_id , element.name)

                let clas   = new Class(class_obj[element.class_id].id, class_obj[element.class_id].school_id, class_obj[element.class_id].name)
                subclass_obj[element.id].setClass(clas)

                let school = new School(school_obj[clas.school_id].id , school_obj[clas.school_id].name)
                subclass_obj[element.id].setSchool(school)

                class_obj[element.class_id].addSubclass(subclass_obj[element.id])
            })


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
                    subclass : Object.values(subclass_obj),
                    class    : Object.values(class_obj),
                    schools  : Object.values(school_obj),
                    users    : users_arr
                }
            })
        })

    }catch(err){
        res.send({
            status  : 500,
            message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
        });
    }
}