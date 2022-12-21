const express = require("express");
const checkAuth = require("../middleware/check-auth");
const repliesAmtCntrl = require("../controllers/replies_amt");

const router = express.Router();

router.put(
    "",
    checkAuth,
    repliesAmtCntrl.repliesAmt
);

module.exports = router;