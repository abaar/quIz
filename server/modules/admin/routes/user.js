const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../auth/verifyToken.js")

const registrationController = require("../app/user.js")

router.get("/all",[verifyToken, verifyAdmin],registrationController.allData)

router.post("/store", [verifyToken, verifyAdmin], registrationController.store)
router.post("/update", [verifyToken, verifyAdmin], registrationController.update)
router.post("/destroy", [verifyToken, verifyAdmin], registrationController.destroy)

module.exports  = router