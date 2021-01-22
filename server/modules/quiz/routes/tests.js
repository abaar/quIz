const express   = require("express")
const { verifyToken } = require("../../auth/verifyToken.js")
const router    = express.Router()


const controller    = require("../app/tests/tests.js")

router.get("/",verifyToken, controller.index);
router.get("/questionCount", verifyToken, controller.questionCount)
router.post("/start", verifyToken, controller.start);
router.post("/continue", verifyToken, controller.continue);

module.exports = router