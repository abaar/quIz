const path  = require('path')
const repo  = require("../../../../repository/userRepository.js")

exports.allData = (req, res)=>{
    try{
        repo.allUsers.then((result)=>{
            console.log(result)
            res.send(JSON.stringify(result))
        });
    }catch(err){
    }
}