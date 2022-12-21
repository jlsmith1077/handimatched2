const express = require("express");
const mailControllers = require("../controllers/mail");

const checkAuth = require("../middleware/check-auth");
const mail = require("../models/mail");


const router = express.Router();

router.post(
  "",
  checkAuth,
  mailControllers.mailCreate
  );

router.get("", mailControllers.mailGet);

router.put("/:id", checkAuth, mailControllers.mailUpdate);

router.patch("/:id", checkAuth, mailControllers.replyUpdate);

router.delete("/:id", checkAuth, mailControllers.mailDelete);


module.exports = router;
