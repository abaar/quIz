const express   = require("express")
const router    = express.Router()

// mini-routes
const user  = require("./user.js")

router.get("/", (req,res)=>{
    res.send("admin-index")
})

router.use("/user", user)

module.exports = router