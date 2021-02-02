const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../../auth/verifyToken.js")

const baseController = require("../../app/competency/base.js")

router.get("/all",[verifyToken, verifyAdmin],baseController.all)

router.post("/store", [verifyToken, verifyAdmin], baseController.store)
router.post("/update", [verifyToken, verifyAdmin], baseController.update)
router.post("/destroy", [verifyToken, verifyAdmin], baseController.destroy)

module.exports  = router