const express = require("express")
const fileExtract = require("../middleware/video_chat_files")
const videochatController = require("../controllers/videochat")
const router = express.Router();


router.get("/:room")

module.exports = router;