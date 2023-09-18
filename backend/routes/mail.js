const express = require("express");
const mailControllers = require("../controllers/mail");
const fileExtractImage = require("../middleware/file");
const fileExtractVideo = require("../middleware/video_file");
const fileExtractImages = require("../middleware/image_video_file")
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post(
  "",
  checkAuth,
  fileExtractImages,
  mailControllers.mailCreate
  );
router.put("",
  checkAuth,
  fileExtractImages,
  mailControllers.mailCreate
);

router.patch("",checkAuth, mailControllers.mailGet);


router.patch("/:id", checkAuth, mailControllers.mailUpdate);

router.delete("/:id", checkAuth, mailControllers.mailDelete);


module.exports = router;
