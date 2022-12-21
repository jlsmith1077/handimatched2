const express = require("express");
const checkAuth = require("../middleware/check-auth");
const postControllers = require("../controllers/post");
const router = express.Router();
const fileExtract = require("../middleware/file");




router.post(
  "",
  checkAuth,
  fileExtract,
  postControllers.postCreate
);

router.patch(
  "/:id",
  checkAuth,
  fileExtract,
  postControllers.postSettings
);
router.put(
  "",
  checkAuth,
  postControllers.postsSettings
);
router.put(
  "/:id",
  checkAuth,
  postControllers.postEdit
);

router.get("", postControllers.postGet);

router.delete("/:id", checkAuth, postControllers.postDelete);

module.exports = router;
