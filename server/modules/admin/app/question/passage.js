const path  = require('path')
const repo  = require("../../../../repository/passageRepository.js")
const repoSubject  = require("../../../../repository/subjectRepository")
const Passage   = require("../../../../models/passages.js")
const Subject   = require("../../../../models/subjects.js")
exports.all = (req, res)=>{
    try{
        Promise.all([
            repo.all(true),
            repoSubject.all(true),
        ]).then((values)=>{
            const passages = values[0]
            const subjects = values[1]

            const subject_obj = {}
            const passage_obj = [] 
            
            subjects.forEach(element =>{
                subject_obj[element.id] = new Subject(element.id , element.name)
            })

            passages.forEach(element =>{
                const hold = new Passage(element.id, element.subject_id, element.name, element.passage)
                hold.setSubject(subject_obj[element.subject_id])

                passage_obj.push(hold)
            })

            res.send({
                status : true,
                data   : {
                    subjects  : Object.values(subject_obj),
                    passages  : passage_obj,
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
    const {value} = req.body
    try{
        if(value.name === null || value.name === ""){
            res.send({
                status  : false,
                message : "Judul Bacaan tidak boleh kosong!"
            }); 

            return
        }

        if(value.bacaan === null || value.bacaan === ""){
            res.send({
                status  : false,
                message : "Bacaan tidak boleh kosong!"
            }); 

            return
        }
        repo.store(new Passage(null, value.subject_id, value.name, value.bacaan)).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menambahkan data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
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
    const {value} = req.body
    try{
        if(value.name === null || value.name === ""){
            res.send({
                status  : false,
                message : "Judul Bacaan tidak boleh kosong!"
            }); 

            return
        }

        if(value.bacaan === null || value.bacaan === ""){
            res.send({
                status  : false,
                message : "Bacaan tidak boleh kosong!"
            }); 

            return
        }

        repo.update(new Passage(value.id, value.subject_id, value.name, value.bacaan)).then((result)=>{
            if(result){
                res.send({
                    status  : true,
                    message : "Berhasil menyimpan data!"
                })
            }else{
                res.send({
                    status  : false,
                    message : "Terjadi kesalahan sistem, mohon menghubungi Admin!"
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

exports.destroy = (req,res) => {
    const {value_ids } = req.body
    try{
        repo.destroy(value_ids).then((result)=>{
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