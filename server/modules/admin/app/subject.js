const path  = require('path')
const repo  = require("../../../repository/subjectRepository")
const Subject   = require("../../../models/subjects.js")

exports.all = (req, res)=>{
    try{
        repo.all().then((result)=>{
            if(result){
                res.send({
                    status : true,
                    data   : {
                        matpel  : result
                    }
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

exports.store = (req,res) => {
    const {matpel} = req.body
    try{
        if(matpel.matpel === null || matpel.matpel === ""){
            res.send({
                status  : false,
                message : "Mata Pelajaran tidak boleh kosong!"
            }); 

            return
        }

        repo.store(new Subject(null, matpel.matpel)).then((result)=>{
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
    const {matpel} = req.body
    try{
        if(matpel.matpel === null || matpel.matpel === ""){
            res.send({
                status  : false,
                message : "Mata Pelajaran tidak boleh kosong!"
            }); 

            return
        }

        repo.update(new Subject(matpel.id, matpel.matpel)).then((result)=>{
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
    const {matpel_ids } = req.body
    try{
        repo.destroy(matpel_ids).then((result)=>{
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