const path  = require('path')
const repo  = require("../../../../repository/userRepository.js")

exports.indexView = (req, res)=>{
    res.sendFile(path.join(__dirname+"/assets/index.html"));
}

exports.indexData = (req, res)=>{
    try{
        repo.allUsers.then((result)=>{
            res.send(JSON.stringify(result))
        });
    }catch(err){
        console.log("error")
        console.log(err)
    }
}