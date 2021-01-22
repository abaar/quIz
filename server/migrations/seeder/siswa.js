const User      = require("../../models/users.js")
const repo      = require("../../repository/userRepository.js")
const bcrypt    = require('bcryptjs');
var siswa = new User(null, 'siswa','siswa','siswa',null, true, 2, 2, 1);
try{
    repo.saveUser(siswa).then(()=>{
        process.exit(1)
    }).catch((err)=>{
        process.exit(1)
    })
}catch(err){
    console.log("failed")
    process.exit(1)
}

