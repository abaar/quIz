const express   = require("express")
const router    = express.Router()

// mini-routes
const user    = require("./user.js")
const subject = require("./subject.js") 

router.get("/", (req,res)=>{
    res.send("admin-index")
})

router.use("/user", user)
router.use("/subject", subject)

module.exports = router