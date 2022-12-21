const express = require("express");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const replyControllers = require("../controllers/reply");


router.post(
  "",
  checkAuth,
  replyControllers.replyCreate
  );

router.get("", replyControllers.replyGet);


  router.delete("/:id", checkAuth, replyControllers.replyDelete);


module.exports = router;
