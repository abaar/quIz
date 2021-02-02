const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../../auth/verifyToken.js")

const coreController = require("../../app/competency/core.js")

router.get("/all",[verifyToken, verifyAdmin],coreController.all)

router.post("/store", [verifyToken, verifyAdmin], coreController.store)
router.post("/update", [verifyToken, verifyAdmin], coreController.update)
router.post("/destroy", [verifyToken, verifyAdmin], coreController.destroy)

module.exports  = router