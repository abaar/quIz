const express   = require("express")
const router    = express.Router()

// mini-routes
const tests  = require("./tests.js")
const live   = require("./live.js")

router.use("/test", tests)
// router.use("/live", live)

module.exports = router