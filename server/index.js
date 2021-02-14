const express = require('express')
const app     = express()
const port    = 8080
const path    = require('path')
const bParser = require("body-parser")
const cors    = require("cors")
const cParser = require("cookie-parser")
require('dotenv').config()
// routes
const admins  = require("./modules/admin/routes/index.js");
const auth    = require("./modules/auth/routes.js");
const quiz    = require("./modules/quiz/routes/index.js")

app.use(cors({credentials: true}))
app.use(cParser())
app.use(express.json());
app.use(bParser.urlencoded({extended:false, limit:"50mb"}));
app.use(express.static(__dirname + '/public'));

app.use("/admin",admins);
app.use("/auth", auth);
app.use("/quiz", quiz)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})