const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Socialuser = require('../models/socialuser');
const Profile = require('../models/profile');
const CreateProfile = require('../controllers/profile')

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

exports.userSignin = (req, res, next) => {
    console.log('signing in :)');
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
                    console.log('token 1', fetchedUser.email, fetchedUser._id)
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
                        fetchedProfile = resProfile;                    
                        console.log('token 2', fetchedProfile.email, fetchedProfile._id)
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

}