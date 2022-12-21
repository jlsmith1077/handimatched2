const express = require("express");
const checkAuth = require("../middleware/check-auth");
const videoControllers = require("../controllers/video");
const videoFileExtract = require("../middleware/video_file");
const router = express.Router();

router.post(
  "",
  checkAuth,
  videoFileExtract,
  videoControllers.videoCreate
  
);


router.get("", videoControllers.videoGet);


router.delete("/:id", checkAuth, videoControllers.videoDelete);

module.exports = router;
