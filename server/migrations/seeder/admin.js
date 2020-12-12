const User = require("../../models/users.js")
const repo = require("../../repository/userRepository.js")
const bcrypt    = require('bcryptjs');
const env       = require("../../config/env.js")
var admin = new User(null, 'admin','admin','admin');

try{
    repo.saveUser(admin)
    process.exit(1)
}catch(err){
    console.log(err)
    process.exit(1)
}
