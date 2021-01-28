const express           = require("express")
const { verifyToken }   = require("../../auth/verifyToken.js")
const router            = express.Router()

const controller = require("../app/live/live")

router.post("/submit", verifyToken, controller.submit)

module.exports = router