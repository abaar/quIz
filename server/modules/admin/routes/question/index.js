const express   = require("express")
const router    = express.Router()

// mini-routes
const passage          = require("./passage.js")
const question         = require("./question.js")

router.use("/passage", passage)
router.use("/question", question)


module.exports = router