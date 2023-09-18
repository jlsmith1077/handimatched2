const express = require("express");
const checkAuth = require("../middleware/check-auth");
const profileControllers = require("../controllers/profile");
const fileExtract = require("../middleware/file");

const router = express.Router();

router.put("/:id",
  checkAuth,
  fileExtract,
  profileControllers.profileEdit
  
);

module.exports = router;