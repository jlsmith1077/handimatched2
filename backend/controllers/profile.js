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
      friendsAmt: req.body.friendsAmt,
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
    });
    Profile.updateOne({ _id: req.params.id, creator: req.userData.userId}, profile)
    .then(result => {
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
  exports.changeProfilePic = (req, res, next)  => {
    console.log('in change profile pic func', req.body.imagePath);
    const creator = req.userData.userId; 
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    console.log('through if check', imagePath)
    Profile.updateOne({creator: creator}, {set: {
      imagePath: image
    }
    })
    .then(result => {
      console.log('modified Count', modifiedCount)
      if (result.modifiedCount > 0) {
        console.log('successful','result', result);
      res.status(200).json({ 
        message: 'Update successful!',
        imagePath: image
         });  
    } else {
      res.status(401).json({message: 'Not authorized to update profile pic'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Was not able to update profile Pic ', modifiedCount
      })
    });
  }

  exports.profileGet = (req, res, next) => {
    console.log('in profile get func')
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

   exports.profileDelete = (req, res, next) => {
    Profile.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Profile Deleted successful'});
      } else {
        res.status(401).json({message: 'Not authorized!...Ugggh'});
      }
    });
  }