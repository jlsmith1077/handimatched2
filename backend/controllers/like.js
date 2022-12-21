const Like = require("../models/like");
const Post = require("../models/post");

exports.likeCreate = (req, res, next) => {
    const username = req.body.username;
    Post.updateOne({_id: req.body.id},
        {$addToSet: { likes: username },
        $inc : {likesAmt: 1}}
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
    Post.updateOne({_id: req.body.id},
        {$pull: { likes: req.body.username },
        $inc : {likesAmt: -1}}
        ).then(result => {
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Like deleted successfully'
            });
        } else {
            res.status(401).json({message: 'not authorized!'});
        }
    });
}