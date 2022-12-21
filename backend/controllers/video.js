const Video = require("../models/video");

exports.videoCreate = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const video = new Video({
      username: req.body.username,
      title: req.body.title,
      videoPath: url + "/videos/" + req.file.filename,
      creator: req.userData.userId
     });
    video.save().then(createdVideo => {
      res.status(201).json({
        
        message: "Video added successfully",
        post: {
          ...createdVideo,
          id: createdVideo._id
        }
      });
    })
    .catch(error => {
        res.status(500).json({
          message: 'Creating a video failed'
        });
    });
  }

  exports.videoGet = (req, res, next) => {
    Video.find()
      .then(documents => {
        res.status(201).json({
          message: 'videos retrieved successfully',
          videos: documents,
        });
      });  
    }

    exports.videoDelete = (req, res, next) => {
        Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
          if (result.n > 0) {
            res.status(200).json({message: 'Deletions successful'});
          } else {
            res.status(401).json({message: 'Not authorized!'});
          }
        });
      }
      