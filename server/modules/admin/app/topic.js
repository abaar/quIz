const path  = require('path')
const repo  = require("../../../repository/topicRepository.js")
const repoSubject  = require("../../../repository/subjectRepository")
const Topic   = require("../../../models/topics.js")
const Subject   = require("../../../models/subjects.js")

exports.all = (req, res)=>{
    try{
        Promise.all(
            [repo.all(true), repoSubject.all(true)]
        ).then((values)=>{
            let topic = values[0]
            let subje = values[1]

            let subject_obj = {}
            let topic_obj   = []


            subje.forEach(element => {
                subject_obj[element.id] = new Subject(element.id, element.name)
            });

            topic.forEach(element => {
                let topic =  new Topic(element.id, element.name, element.subject_id)
                topic.setSubject(subject_obj[element.subject_id])
                topic_obj.push(topic)

                subject_obj[element.subject_id].addTopic(topic_obj[element.id])
            })

            res.send({
                status : true,
                data   : {
                    subjects  : Object.values(subject_obj),
                    topics    : topic_obj
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
    const {topic} = req.body
    try{
        if(topic.name === null || topic.name === ""){
            res.send({
                status  : false,
                message : "Topik Mata Pelajaran tidak boleh kosong!"
            }); 

            return
        }


        repo.store(new Topic(null, topic.name, topic.subject_id)).then((result)=>{
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
    const {topic} = req.body
    try{
        if(topic.name === null || topic.name === ""){
            res.send({
                status  : false,
                message : "Topik Mata Pelajaran tidak boleh kosong!"
            }); 

            return
        }

        repo.update(new Topic(topic.id, topic.name, topic.subject_id)).then((result)=>{
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
    const {topic_ids } = req.body
    try{
        repo.destroy(topic_ids).then((result)=>{
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