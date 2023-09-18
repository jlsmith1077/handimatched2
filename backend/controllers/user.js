const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Socialuser = require('../models/socialuser');
const Profile = require('../models/profile');
const CreateProfile = require('../controllers/profile')

const login = (id) => {
    Profile.updateOne({creator: id}, {$set: {online: false}})
}

exports.userSignup = (req, res, next) => {
    let fetchedProfile;
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
         const user = new User({
          email: req.body.email,
          password: hash
      });
      user.save()
      .then(result => {
          console.log('token ', result.email, result._id)
        const token = jwt.sign(
            { email: result.email,
              userId: result._id,
            },
            process.env.JWT_KEY,
            { expiresIn: '10h' }
        );
          res.status(201).json({
              token: token,
              expiresIn: 36000,
              message: 'User created',
              userId: result._id,
              user: user
          });
      })
      .catch(err => {
          res.status(500).json({
                  message: 'Username taken Please try another Username!'
          });
      });
    });
}

 exports.logOut = (req, res, next) => {
    Profile.updateOne({creator: req.body.id}, {$set: {online: 'false'}})
    .then(result => {
         if(result.matchedCount < 1) {
            return res.status(201).json({
                message:'Logged Out!'
            })
         }
        if (result.modifiedCount > 0) {
            res.status(200).json({ 
                message: 'Logged Out!'
                                    });  
            } else {
                res.status(401).json({
                    message: 'Not authorized'
                });
            }
     }).catch(error => {
            res.status(500).json({
            message: 'Was not able to logout'
            })
        });
    }


// exports.logout = (req, res, next) => {
//     console.log('id in log out', req.userId);
//     Profile.updateOne({creator: req.body.id}, {$set: {online: false}})
//     .then(result => {
//         if (result.modifiedCount > 0) {
//         res.status(200).json({ 
//             message: 'Logged Out!'
//                                 });  
//         } else {
//             res.status(401).json({
//                 message: 'Not authorized'
//             });
//             }
//      }).catch(error => {
//             res.status(500).json({
//             message: 'Was not able to logout'
//             })
//         });
//     }
exports.userSignin = (req, res, next) => {
    let fetchedProfile;
    let fetchedUser;
    User.findOne({ email: req.body.email }).collation({locale: 'en_US', strength:1})
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Authorization failed!'
                });
            }
            Profile.findOne({ email: req.body.email }).collation({locale: 'en_US', strength:1})
            .then(resProfile => {
                if (!resProfile) {
                    const token = jwt.sign(
                        { email: fetchedUser.email,
                            userId: fetchedUser._id    
                        },
                        process.env.JWT_KEY,
                        { expiresIn: '10h'}
                        );
                        res.status(200).json({
                            token: token,
                            expiresIn: 36000,
                            userId: fetchedUser._id,
                            username: fetchedUser.username
                        });
                    } else {
                        Profile.updateOne({creator: fetchedUser._id}, {$set: {online: "true"}})
                        .then(result => {
                            if (result.modifiedCount > 0) {
                            } else {                                }
                        })
                      .catch(error => {
                       console.log('error' + error)
                      });
                        fetchedProfile = resProfile;
                        const token = jwt.sign(
                            { email: fetchedUser.email,
                                userId: fetchedUser._id    
                            },
                            process.env.JWT_KEY,
                            { expiresIn: '10h'}
                            );
                    res.status(200).json({
                        token: token,
                        expiresIn: 36000,
                        userId: fetchedUser._id,
                        username: fetchedProfile.username,
                        user: fetchedProfile
                    });
                }
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                    message: 'Invalid E-mail or Password'
                });
        });                    
    })
}
exports.socialSignin = (req, res, next) => {
    console.log('social login', req.body)
    let fetchedUser;
    User.findOne({ email: req.body.email }).collation({locale: 'en_US', strength:1})
    .then(user => {
        if (!user) {
            bcrypt.hash(req.body.email, 10)
            .then(hash => {
                const user = new User({
                email: req.body.email,
                password: hash
                });
                fetchedUser = user;
                user.save();
                let imagePath = req.body.photoUrl;
                        const profile = new Profile({
                        username: req.body.name,
                        fullname: req.body.name,
                        email: req.body.email,
                        imagePath: imagePath,
                        creator: fetchedUser._id
                        });
                        fetchedProfile = profile;
                        profile.save()
                        console.log('No fetchedProfile, but created new profile')
                const token = jwt.sign(
                    { email: fetchedUser.email,
                    userId: fetchedUser._id
                    },
                    process.env.JWT_KEY,
                    { expiresIn: '24h'}
                );
                res.status(200).json({
                token: token,
                expiresIn: 36000,
                userId: fetchedUser._id,
                user: fetchedProfile
                });                
            })
            .catch(err => {
                    console.log(err);
                  return  res.status(401).json({
                            message: 'Username taken'
                        });
                });
        } else {
            fetchedUser = user;
            Profile.findOne({email: req.body.email})
                .then(resProfile => {
                    if (!resProfile) {
                        const token = jwt.sign(
                            { email: fetchedUser.email,
                            userId: fetchedUser._id
                            },
                            process.env.JWT_KEY,
                            { expiresIn: '10h'}
                        );
                        res.status(200).json({
                        token: token,
                        expiresIn: 36000,
                        userId: fetchedUser._id
                        });
                    } else {
                        fetchedProfile = resProfile;
                        console.log('fetchedProfile');
                            const token = jwt.sign(
                                { email: fetchedUser.email,
                                userId: fetchedUser._id
                                },
                                process.env.JWT_KEY,
                                { expiresIn: '10h'}
                            );
                            res.status(200).json({
                            token: token,
                            expiresIn: 36000,
                            userId: fetchedUser._id,
                            username: fetchedUser.username,
                            user: fetchedProfile
                            });
                        }
                })
            
            }
    })
    .catch(err => {
    console.log(err);
        return res.status(401).json({
            message: 'Invalid E-mail or Password'
        });
    });

exports.logout = (req, res, next) => {
    console.log('hey')
    // Profile.updateOne({creator: req.body.id}, {$set: {online: false}})
    // .then(result => {
    //     if (result.modifiedCount > 0) {
    //     res.status(200).json({ message: 'Update successful!'
    //                             });  
    //     } else {
    //         res.status(401).json({message: 'Not authorized'});
    //         }
    //  })
    //     .catch(error => {
    //         res.status(500).json({
    //         message: 'Was not able to logout' + error
    //         })
    //     });
    }

}