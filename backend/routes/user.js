const express = require('express');
const UserController = require("../controllers/user");

const router = express.Router();


router.post("/signup", UserController.userSignup);

router.post('/signin', UserController.userSignin);

router.post('/socialSignin', UserController.socialSignin);

module.exports = router;