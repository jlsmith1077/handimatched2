const express = require("express");
const likeControllers = require("../controllers/videolikes");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.put(
    "",
    checkAuth,
    likeControllers.likeCreate
);

router.get(
    "",
    likeControllers.likeGet
);

router.patch(
    "",
    checkAuth,
    likeControllers.likeDelete
);

module.exports = router;