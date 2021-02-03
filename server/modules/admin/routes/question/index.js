const express   = require("express")
const router    = express.Router()

// mini-routes
const passage          = require("./passage.js")

router.use("/passage", passage)


module.exports = router