const express   = require("express")
const router    = express.Router()

// mini-routes
const registration  = require("./registration.js")

router.get("/", (req,res)=>{
    res.send("admin-index")
})

router.get("/registration", registration)

module.exports = router