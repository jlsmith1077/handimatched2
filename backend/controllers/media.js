const Profile = require("../models/profile");

exports.changeProfilePic = (req, res, next)  => {
      const profileQuery = Profile.find().collation({locale: 'en_US', strength:1});
      let fetchedProfiles; 
      let results
      const id =  req.body.id;
      const url = req.protocol + "://" + req.get("host");
      let imagePath = url + "/images/" + req.file.filename      
      Profile.updateOne({creator: id}, { $set: { imagePath: imagePath} })
      .then(result => {
        console.log('1st result', result)
        results = result;
        profileQuery.then(documents => {
          fetchedProfiles = documents;     
        }).then(result2 => {
          if (results.modifiedCount > 0) {
              res.status(200).json({ 
                  message: 'Update successful!',
                  image: imagePath,
                  profiles: fetchedProfiles
                });  
            } else {
                  res.status(401).json({message: 'Not authorized to update profile pic'});
                }
        })
      })
      .catch(error => {        
        console.log('error', error);
        res.status(500).json({
          message: 'Was not able to update pic,'
        })
      });
    }

exports.profileAddMedia = (req, res, next) => {
  console.log('id in PROFILE ADD MEDIA', req.body.id)
  const zero = 0;
  const id = req.body.id;
  const title = 
  
  req.body.title
  const url = req.protocol + "://" + req.get("host");
  let imagePath = url + "/images/" + req.file.filename;  
  Profile.updateOne({creator: id}, {$addToSet: 
    {
      imageGallery: {
        title: title,
        path: imagePath,
        likes: [] ,
        likesAmt: 0 
      }
    }
  })
  .then(result => {
    if (result.modifiedCount > 0) {
      console.log('results', result)
       res.status(200).json({ 
          message: 'Update successful!'
       });  
  } else {
        console.log('image not updated no match')
        res.status(401).json({message: 'Not authorized to update profile pic'});
      }
  })
  .catch(err => {
      console.log('image not updated dont know what happened', err)
      return res.status(401).json({
      message: 'update unsuccessful'
    });
  });
}

exports.deleteMediaFromArray = (req, res, next) => {
  const id = req.body.id
  Profile.findOneAndUpdate(
    {creator: req.userData.userId}, 
    {$pull: {imageGallery: {_id: id}}}
  )
  .then(result => {
    if (result.modifiedCount > 0) {
       res.status(200).json({ 
          message: 'Update successful!'
       });  
  } else {
        console.log('image not updated no match')
        res.status(401).json({message: 'Not authorized to update profile pic'});
      }
  })
  .catch(err => {
      console.log('image not updated dont know what happened', err)
      return res.status(401).json({
      message: 'update unsuccessful'
    });
  });
}
