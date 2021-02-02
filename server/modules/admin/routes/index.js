const express   = require("express")
const router    = express.Router()

// mini-routes
const user    = require("./user.js")
const subject = require("./subject.js") 
const topic = require("./topic.js") 
const competency = require("./competency/index.js") 

router.get("/", (req,res)=>{
    res.send("admin-index")
})

router.use("/user", user)
router.use("/subject", subject)
router.use("/topic", topic)
router.use("/competency", competency)

module.exports = router