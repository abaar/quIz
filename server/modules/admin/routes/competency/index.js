const express   = require("express")
const router    = express.Router()

// mini-routes
const core          = require("./core.js")
const base          = require("./base.js")
const specific      = require("./specific.js")

router.use("/core", core)
router.use("/base", base)
router.use("/specific", specific)

module.exports = router