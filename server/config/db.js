const mysql = require("mysql")

const db = mysql.createPool({
    connectionLimit : 25,
    host            : "localhost",
    user            : "root",
    password        : "12345678",
    database        : "akbar_play_node"
})
module.exports = db