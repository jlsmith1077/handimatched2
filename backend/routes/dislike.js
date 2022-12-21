const express = require("express");
const dislikeControllers = require("../controllers/dislike");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.put(
    "",
    checkAuth,
    dislikeControllers.dislikeCreate
);

router.get(
    "",
    dislikeControllers.dislikeGet
);

router.patch(
    "",
    checkAuth,
    dislikeControllers.dislikeDelete
);

module.exports = router;


