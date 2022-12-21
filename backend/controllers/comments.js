const Comment = require("../models/comments");
const Post = require("../models/post");
const post = new Post;


exports.commentCreate = (req, res, next) => {
    console.log(req.body.comment, req.body.commentor);
    const postQuery = Post.find();
    let  fetchedPosts;
    Post.findOne({_id: req.body.id}, (err, post) => {
      post.comments.push({
        comment: req.body.comment,
        commentor: req.body.commentor,
        postId: req.body.id
        });
        post.save( (err) => {
          if (!err) {
            console.log('Comment saved successfully!')
          } else {
            res.status(401).json({message: 'Not authorized'});
            }
        });
    });
    postQuery.then(posts => {
      fetchedPosts = posts;      
      res.status(200).json({
        message: 'Comment saved successfully!',
        posts: fetchedPosts
      });
    });
  }

  exports.commentGet = (req, res, next) => {
    Comment.find()
      .then(documents => {
        res.status(201).json({
          message: 'comments retrieved successfully',
          comments: documents,
        });
      });  
    }

    exports.commentDelete = (req, res, next) => {
        Comment.deleteOne({ _id: req.params.id }).then(result => {
          if (result.n > 0) {
            res.status(200).json({message: 'Comment Deleted successful'});
          } else {
            res.status(401).json({message: 'Not authorized to delete!...Ugggh'});
          }
        });
      }