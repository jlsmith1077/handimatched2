const Like = require("../models/like");
const Profile = require("../models/profile");

exports.likeCreate = (req, res, next) => {
    console.log('req', req.body)
    const username = req.body.username;
    const mediaId = req.body.mediaId;
    Profile.updateOne({_id: req.body.id},
        {
            $addToSet: { "imageGallery.$[elem].likes": username },
            $inc: {"imageGallery.$[elem].likesAmt": 1}
        },
            {arrayFilters: [ {"elem._id": mediaId}]}
        ) 
        .then(result => {
            if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Update successful!'
                                    });  
            } else {
                res.status(401).json({message: 'Not authorized'});
                }
        })
      .catch(error => {
        console.log('error message', error)
        res.status(500).json({
          message: 'Was not able to update profile '
        })
      });
}


exports.likeGet = (req, res, next) => {
    Like.find()
    .then(documents => {
        res.status(201).json({
            message: 'Like retrieved successfully',
            like: documents,
        });
    });
}

exports.likeDelete = (req, res, next) => {
    Profile.updateOne({_id: req.body.id, imageGallery: { $elemMatch: { _id: req.body.mediaId } } },
        {$pull: { "imageGallery.$.likes": req.body.username },
        $inc : {"imageGallery.$.likesAmt": -1}}
        ).then(result => {
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Image like deleted successfully'
            });
        } else {
            res.status(401).json({message: 'not authorized!'});
        }
    });
}