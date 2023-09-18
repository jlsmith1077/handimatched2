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
    // fileFilter(req, file, cb) {
    //   if(!file.originalname.match(/\.(jpg|png|jpeg|3gp|mov|mp4|wmv|webm)$/))
    //   return cb(new Error('Not a valid file to be uploaded') )
    // },
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "images");
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

  module.exports = multer({ storage: storage }).single("image");