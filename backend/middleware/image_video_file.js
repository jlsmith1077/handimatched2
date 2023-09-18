const multer = require("multer");


const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "video/3gpp": "3gp",
    "video/quicktime": "mov",
    "video/mp4": "mp4",
    "video/x-ms-wmv": "wmv",
    "video/webm": "webm"
  };
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('file in multer', req.files)
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "messagemedia");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name);
    }
  } );

  module.exports = multer({ storage: storage}).array("images");