const multer = require("multer");

const MIME_TYPE_MAP = {
    "video/quicktime": "mov",
    "video/mp4": "mp4",
    "video/x-ms-wmv": "wmv",
    "video/webm": "webm",
    "application/ogg":"ogg",
    "application/x-mpegURL": "m3u8",
    "video/MP2T": "ts",
    "video/ogg": "ogg",
    "video/JPEG": "JPEG",
    "video/MPV": "MPV",
    "video/3gpp": "3gpp",
    "video/3gpp2": "3gpp2",
    "video/x-flv": "flv",
    "video/x-msvideo": "avi"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "videos");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });

  module.exports = multer({ storage: storage }).single("video");