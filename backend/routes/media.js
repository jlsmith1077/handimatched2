const express = require("express");
const checkAuth = require("../middleware/check-auth");
const mediaControllers = require("../controllers/media");
const router = express.Router();
const fileExtract = require("../middleware/file");


router.put("",
// checkAuth,
fileExtract,
mediaControllers.changeProfilePic
);
router.patch("",
// checkAuth,
fileExtract,
mediaControllers.profileAddMedia
);
// router.delete("",
// // checkAuth,
// mediaControllers.deleteMediaFromArray
// );

module.exports = router;