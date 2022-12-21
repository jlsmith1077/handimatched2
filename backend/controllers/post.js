const Post = require("../models/post");

exports.postCreate = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      username: req.body.username,
      messagepost: req.body.messagepost,
      imagePath: url + "/images/" + req.file.filename,
      format: req.body.format,
      section: req.body.section,
      time: req.body.time,
      title: req.body.title,
      privacy: req.body.privacy,
      location: req.body.location,
      userPic: req.body.userPic,
      creator: req.userData.userId,
      likeAmt: 0,
      dislikesAmt: 0,
      likes: [],
      dislikes: [],
      comments: []
     });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
        res.status(500).json({
          message: 'Creating a post failed'
        });
    });
  }

  exports.postsSettings = (req, res, next) => {
    const checkFor = req.userData.userId;
    const setting = req.body.setting
    let fetchUser = Post.updateMany({creator: checkFor}, {$set: {setting: setting}}, {multi: true});

    fetchUser.then(result => {
      res.status(200).json({
        message: 'Posts Updated',
        setting: setting
      })
      .catch(err => {
        return res.status(401).json({
          message: 'Unable to update posts settings',
          setting: setting
        });
      });
    })
  }
  exports.postSettings = (req, res, next) => {
    const checkFor = req.params.id;
    const setting = req.body.setting
    let fetchUser = Post.updateOne({_id: checkFor}, {$set: {setting: setting}}, {multi: true});

    fetchUser.then(result => {
      res.status(200).json({
        message: 'Post Updated',
        setting: setting
      })
      .catch(err => {
        return res.status(401).json({
          message: 'Unable to update post setting',
          setting: setting
        });
      });
    })
  }

  exports.postEdit = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      username: req.body.username,
      messagepost: req.body.messagepost,
      imagePath: imagePath,
      creator: req.userData.userId,
      responder: req.body.id
    });
    Post.updateOne({ _id: req.params.id }, post)
    .then(result => {
      if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Update successful!'   });  
    } else {
      res.status(401).json({message: 'Not authorized'});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Was not able to update post '
      })
    });
  }

  exports.postGet = (req, res, next) => {
    const postQuery = Post.find();
     postQuery.then(documents => {
       res.status(200).json({
         message: 'Fetched Post',
         posts: documents
      })       
     })
     .catch(error => {
       res.status(500).json({
         message: 'Was unable to retrieve posts'
       });
     });
   }

   exports.postDelete = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({message: 'Deletions of post successful'});
      } else {
        res.status(401).json({message: 'Not authorized!'});
      }
    });
  }
