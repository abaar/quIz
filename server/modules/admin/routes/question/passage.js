const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../../auth/verifyToken.js")

const passageController = require("../../app/question/passage.js")

router.get("/all",[verifyToken, verifyAdmin],passageController.all)

router.post("/store", [verifyToken, verifyAdmin], passageController.store)
router.post("/update", [verifyToken, verifyAdmin], passageController.update)
router.post("/destroy", [verifyToken, verifyAdmin], passageController.destroy)

module.exports  = router