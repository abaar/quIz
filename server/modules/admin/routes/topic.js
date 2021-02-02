const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../auth/verifyToken.js")

const topicController = require("../app/topic.js")

router.get("/all",[verifyToken, verifyAdmin],topicController.all)

router.post("/store", [verifyToken, verifyAdmin], topicController.store)
router.post("/update", [verifyToken, verifyAdmin], topicController.update)
router.post("/destroy", [verifyToken, verifyAdmin], topicController.destroy)

module.exports  = router