const express = require('express');
const UserController = require("../controllers/user");

const router = express.Router();

router.post('/signin', UserController.userSignin);