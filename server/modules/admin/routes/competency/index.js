const express   = require("express")
const router    = express.Router()

// mini-routes
const core    = require("./core.js")

router.use("/core", core)

module.exports = router