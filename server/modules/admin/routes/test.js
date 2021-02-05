const express   = require("express")
const router    = express.Router()

const { verifyToken, verifyAdmin, verifyUser }   = require("../../auth/verifyToken.js")

const testController = require("../app/test.js")

router.get("/all",[verifyToken, verifyAdmin],testController.all)

router.post("/store", [verifyToken, verifyAdmin], testController.store)
router.post("/update", [verifyToken, verifyAdmin], testController.update)
router.post("/destroy", [verifyToken, verifyAdmin], testController.destroy)

module.exports  = router