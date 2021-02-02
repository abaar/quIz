const express   = require("express")
const { route } = require("./core.js")
const router    = express.Router()

// mini-routes
const core    = require("./core.js")
const base    = require("./base.js")

router.use("/core", core)
router.use("/base", base)

module.exports = router