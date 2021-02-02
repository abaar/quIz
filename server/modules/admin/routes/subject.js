const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../auth/verifyToken.js")

const subjectController = require("../app/subject.js")

router.get("/all",[verifyToken, verifyAdmin],subjectController.all)

router.post("/store", [verifyToken, verifyAdmin], subjectController.store)
router.post("/update", [verifyToken, verifyAdmin], subjectController.update)
router.post("/destroy", [verifyToken, verifyAdmin], subjectController.destroy)

module.exports  = router