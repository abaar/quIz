const express   = require("express")
const router    = express.Router()
const path      = require("path")

const registrationController = require("../app/registration/registration.js")

router.get("/", registrationController.indexView)

router.get("/data",registrationController.indexData)

module.exports  = router