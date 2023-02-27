const express = require("express");
const checkAuth = require("../middleware/check-auth");
const mediaControllers = require("../controllers/media");
const router = express.Router();
const fileExtract = require("../middleware/file");

// router.patch(
//     "",
//     checkAuth,
//     profileControllers.changeProfilePic
// );
router.put(
    "",
    checkAuth,
    fileExtract,
    mediaControllers.profileAddMedia
);

router.patch("",
  checkAuth,
  fileExtract,
  mediaControllers.changeProfilePic
);

module.exports = router;