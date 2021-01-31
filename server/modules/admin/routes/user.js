const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin }   = require("../../auth/verifyToken.js")

const registrationController = require("../app/user/user.js")

router.get("/data",[verifyToken, verifyAdmin],registrationController.indexData)

module.exports  = router