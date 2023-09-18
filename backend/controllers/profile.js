const Profile = require("../models/profile");


exports.profileCreate = (req, res, next) => {
  let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const profile = new Profile({
      username: req.body.username,
      location: req.body.location,
      fullname: req.body.fullname,
      email: req.body.email,
      gender: req.body.gender,
      interest: req.body.interest,
      imagePath: imagePath,
      creator: req.userData.userId,
      friends: [],
      online: 'true',
      friendsAmt: req.body.friendsAmt,
      imageGallery: [],
      videoGallery: []
     });
    profile.save()
    .then(createdProfile => {
      console.log('created Profile', createdProfile);
      res.status(201).json({
        message: "Profile added successfully",
        profile: {
        ...createdProfile,
        id: createdProfile._id
        }
      });
    })
    .catch(error => {
        res.status(500).json({
          message: 'Creating a profile failed'
        });
    });
  };

  exports.logOut = (req, res, next) => {
    console.log('req', req.body, req)
    // const username = req.body.username;
    // Post.updateOne({_id: req.body.id},
    //     {$addToSet: { likes: username },
    //     $inc : {likesAmt: 1}}
    //     ) 
    //     .then(result => {
    //         if (result.modifiedCount > 0) {
    //         res.status(200).json({ message: 'Update successful!'
    //                                 });  
    //         } else {
    //             res.status(401).json({message: 'Not authorized'});
    //             }
    //     })
    //   .catch(error => {
    //     res.status(500).json({
    //       message: 'Was not able to update profile '
    //     })
    //   });
}

  exports.socialLogin = () => {
    const url = req.protocol + "://" + req.get("host");
    Profile.findOne({_id: req.body.email}).then(
      results => {
        if(!results) {
          profile = new Profile({
            username: req.body.firstName,
            email: req.body.email,
            imagePath: req.body.photoUrl,
            creator: req.body.id
           });
          profile.save().then(createdProfile => {
            res.status(201).json({
              message: "Profile added successfully",
              profile: {
              ...createdProfile,
              id: createdProfile._id
              }
            });
          })
          .catch(error => {
              res.status(500).json({
                message: 'Creating a profile failed'
              });
          });
        }
      }
    )
  }

  exports.profileEdit = (req, res, next) => {
    console.log('creator id', req.userData.userId)
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const profile = new Profile({
      _id: req.body.id,
      username: req.body.username,
      email: req.body.email,
      imagePath: imagePath,
      location: req.body.location,
      interest: req.body.interest,
      gender: req.body.gender,
      fullname: req.body.fullname,
      creator: req.userData.userId,
      friends: req.body.friends,
      friendsAmt: req.body.friendsAmt,
      imageGallery: req.body.imageGallery,
      videoGallery: req.body.videoGallery,
      online: true
    });
    Profile.updateOne({ _id: req.params.id, creator: req.userData.userId}, profile)
    .then(result => {
      console.log('result', result)
      if (result.modifiedCount > 0) {
      res.status(200).json({ 
        message: 'Update successful!',
        profile: profile
         });  
    } else {
      console.log('in else statement')
      res.status(401).json({message: 'Not authorized'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Was not able to update profile'
      })
    });
  }

  exports.profileGet = (req, res, next) => {
    const profileQuery = Profile.find().collation({locale: 'en_US', strength:1});
    let fetchedProfiles; 
    profileQuery.then(documents => {
      fetchedProfiles = documents;     
     })
     .then(count => {
       res.status(200).json({
         message: 'Fetched Profiles',
         profiles: fetchedProfiles
       });
     })
     .catch(error => {
       res.status(500).json({
         message: 'Was unable to retrieve profile'
       });
     });
   }

   exports.getProfileEdit = (req, res, next) => {
      Profile.findById(req.params.id).collation({locale: 'en_US', strength:1})
      .then(profile => {
        if(!profile) {
          return res.status(401).json({
            message:'Profile Not Found'
          });
        }
        fetchedProfile = profile;
        return fetchedProfile
      });
      res.status(200).json({
        message: 'Here is your profile',
        profile: fetchedProfile
      });
   }
   
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

   exports.profileDelete = (req, res, next) => {
    Profile.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Profile Deleted successful'});
      } else {
        res.status(401).json({message: 'Not authorized!...Ugggh'});
      }
    });
  }