const Disike = require("../models/dislike");
const Post = require("../models/post");

exports.dislikeCreate = (req, res, next) => {
    const username = req.body.username;
    Post.updateOne({_id: req.body.id},
        {$addToSet: { dislikes: username },
        $inc : {dislikesAmt: 1}}
        )
    .then(result => {
        if (result.modifiedCount > 0) {
                res.status(200).json({ 
                message: 'Update successful!'
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

exports.dislikeGet = (req, res, next) => {
    Post.updateOne({_id: req.body.id},
        {$pull: { dislikes: req.body.userId },
        $inc : {dislikesAmt: -1}}
        ).then(result => {
            if (result.modifiedCount > 0) {
                res.status(200).json({
                    message: 'Dislike deleted successfully'
                });
            } else {
                res.status(401).json({message: 'not authorized!'});
            }
        });
}

exports.dislikeDelete = (req, res, next) => {
    Post.updateOne({_id: req.body.id},
        {$pull: { dislikes: req.body.username },
        $inc : {dislikesAmt: -1}}
        ).then(result => {
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: 'Dislike deleted successfully'
            });
        } else {
            res.status(401).json({message: 'not authorized!'});
        }
    });
}