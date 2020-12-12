const express   = require("express")
const router    = express.Router()

const authController = require("./auth.js")
const { verifyToken } = require("./verifyToken.js")

router.post("/refresh",verifyToken, authController.refresh)
router.post("/logout",verifyToken, authController.logout)
router.post("/attempt", authController.attempt )

module.exports = router