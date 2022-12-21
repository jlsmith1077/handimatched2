const express = require("express");
const checkAuth = require("../middleware/check-auth");
const friendControllers = require("../controllers/friend");

const router = express.Router();

router.put(
    "",
    checkAuth,
    friendControllers.friendCreate
);

router.get(
    "",
    friendControllers.friendGet
);

router.delete(
    "/:id",
    checkAuth,
    friendControllers.friendDelete
);

module.exports = router;


