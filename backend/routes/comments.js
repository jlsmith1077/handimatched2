const express = require("express");
const commentControllers = require("../controllers/comments");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.put(
  "",
  checkAuth,
  commentControllers.commentCreate
  
);

router.get("", commentControllers.commentGet);

router.delete("/:id", checkAuth, commentControllers.commentDelete);

module.exports = router;