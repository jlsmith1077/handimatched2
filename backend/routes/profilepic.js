const express = require("express");
const checkAuth = require("../middleware/check-auth");
// const profilePicControllers = require("../controllers/profilepic");
const router = express.Router();
const fileExtract = require("../middleware/file");

// router.patch("",
//   checkAuth,
//   fileExtract,
//   profilePicControllers.changeProfilePic
// );



module.exports = router;