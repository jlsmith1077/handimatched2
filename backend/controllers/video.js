const Video = require("../models/video");
const Profile = require("../models/profile");

exports.videoCreate = (req, res, next) => {
  console.log('video title', req.body.creator)
  const zero = 0;
  const creator = req.body.creator;
  const title = req.body.title;
    const url = req.protocol + "://" + req.get("host");
  const videoPath = url + "/videos/" + req.file.filename;
  Profile.updateOne({creator: creator}, { $addToSet:
     { 
      videoGallery: {
          title: title,
          path: videoPath,
          likes: [],
          likesAmt: 0 
        }
      }
    })
  .then(result => {
    if (result.modifiedCount > 0) {
       res.status(200).json({ 
          message: 'Update successful!'
        });
  } else {
        console.log('video not added to profile')
        res.status(401).json({message: 'Video not added to profile'});
  }
  })
  .catch(err => {
      console.log('image not updated dont know what happened', err)
      return res.status(401).json({
      message: 'update unsuccessful'
        });
      });  
    }
    exports.videoSave = (req, res, next) => {
      console.log('video title', req.body.id, req.body.title);
      const zero = 0;
      const id = req.body.id;
      const title = req.body.title;
      const url = req.protocol + "://" + req.get("host");
      const videoPath = url + "/videos/" + req.file.filename;
      Profile.updateOne({creator: id}, { $addToSet:
         { 
          videoGallery: {
              title: title,
              path: videoPath,
              likes: [],
              likesAmt: 0 
            } 
          }
        })
      .then(result => {
        console.log('results', result.modifiedCount, result.matchedCount);
        if (result.modifiedCount > 0) {
          console.log('updated');
           res.status(200).json({ 
              message: 'Update successful!'
           });  
      } else {
            console.log('video not added to profile')
            res.status(401).json({message: 'Video not added to profile'});
          }
      })
      .catch(err => {
          console.log('image not updated dont know what happened', err)
          return res.status(401).json({
          message: 'update unsuccessful'
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
      