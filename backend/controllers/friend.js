const Friend = require("../models/friend");
const Profile = require("../models/profile");

exports.friendCreate = (req, res, next) => {
    console.log('username', req.body.username);
    console.log('id', req.body.id);
    const username = req.body.username;
    const profileQuery = Profile.find();
    let fetchedProfiles; 
    Profile.updateOne({creator: req.body.id},
        {$addToSet: { friends: username },
        $inc : {friendsAmt: 1}}
        )
        .then(profileQuery.then(documents => {
            fetchedProfiles = documents;
            console.log('documents', fetchedProfiles);
            return fetchedProfiles;
          })) 
            .then(result => {
                if (result.n > 0) {
                res.status(200).json({ message: 'Update successful!', 
                                    profiles: fetchedProfiles
                                        });  
            } else {
                res.status(401).json({message: 'Something went wrong'});
                }
            })
            .catch(error => {
                res.status(500).json({
                message: 'Was not able to update profile '
                })
            });
}

exports.friendGet = (req, res, next) => {
    Friend.find()
    .then(documents => {
        res.status(201).json({
            message: 'Friend retrieved successfully',
            friend: documents,
        });
    });
}

exports.friendDelete = (req, res, next) => {
    Friend.deleteOne({_id: req.params.id
    }).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                message: 'Friend deleted successfully'
            });
        } else {
            res.status(401).json({message: 'not authorized!'});
        }
    });
}