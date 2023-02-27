const Profile = require("../models/profile");


exports.profileAddMedia = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const id = req.body.id;
  const zero = 0;
  const creator = req.body.creator
  let path = url + "/images/" + req.file.filename;  
  let fetchUser = Profile.updateOne({_id: id}, {$addToSet: 
    {
      imageGallery: {
        title: req.body.title,
        path: path,
        likes: zero 
      }
    }
  })
  const profile = Profile.findOne({_id: req.bod.id})
  fetchUser.then(result => {
    console.log('result', result);
    if(result.matchedCount > 0) {
      res.status(200).json({
        message: 'update successful',
        profile: profile,
      })
    } else {
      return res.status(401).json({
        message: 'update unsuccessful'
      });
    }
  })
  .catch(err => {
    return res.status(401).json({
      message: 'update unsuccessful'
    });
  });
}

exports.changeProfilePic = (req, res, next)  => {
  const url = req.protocol + "://" + req.get("host");
  let imagePath = url + "/images/" + req.file.filename
  console.log('in change profile pic func and id', req.body.id, '--', imagePath);
  Profile.updateOne({_id: req.body.id}, { $set: { imagePath: imagePath} })
  .then(result => {
    if (result.modifiedCount > 0) {
    res.status(200).json({ 
      message: 'Update successful!',
      imagePath: imagePath
       });  
  } else {
    res.status(401).json({message: 'Not authorized to update profile pic'});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Was not able to update pic'
    })
  });
}