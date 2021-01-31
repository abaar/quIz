const path  = require('path')
const repo  = require("../../../../repository/userRepository.js")

exports.indexData = (req, res)=>{
    try{
        repo.allUsers.then((result)=>{
            res.send(JSON.stringify(result))
        });
    }catch(err){
    }
}