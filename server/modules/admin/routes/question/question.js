const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../../auth/verifyToken.js")

const questionController = require("../../app/question/question.js")

router.get("/all",[verifyToken, verifyAdmin],questionController.all)

router.post("/store", [verifyToken, verifyAdmin], questionController.store)
router.post("/update", [verifyToken, verifyAdmin], questionController.update)
router.post("/destroy", [verifyToken, verifyAdmin], questionController.destroy)

module.exports  = router