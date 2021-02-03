const express   = require("express")
const router    = express.Router()
const path      = require("path")
const { verifyToken, verifyAdmin, verifyUser }   = require("../../../auth/verifyToken.js")

const specificController = require("../../app/competency/specific.js")

router.get("/all",[verifyToken, verifyAdmin],specificController.all)

router.post("/store", [verifyToken, verifyAdmin], specificController.store)
router.post("/update", [verifyToken, verifyAdmin], specificController.update)
router.post("/destroy", [verifyToken, verifyAdmin], specificController.destroy)

module.exports  = router