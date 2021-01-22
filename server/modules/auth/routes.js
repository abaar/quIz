const express   = require("express")
const router    = express.Router()

const authController = require("./auth.js")
const { refreshToken } = require("./verifyToken.js")

router.post("/refresh",refreshToken, authController.refresh)
router.post("/logout",refreshToken, authController.logout)
router.post("/attempt", authController.attempt )

module.exports = router