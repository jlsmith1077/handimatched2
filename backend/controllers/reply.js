const Reply = require("../models/reply");

const Mail = require("../models/mail");
exports.replyCreate = (req, res, next) => {
    console.log('receivername', req.body.receivername);
    const id = req.body.mailId;
    console.log('reply', req.body.mailId);
    const reply = new Reply({
      content1: req.body.content1,
      creator: req.body.creator,
      mailId: req.body.mailId,
      username: req.body.username,
      receivername: req.body.receivername,
      messageTime: req.body.messageTime
    });
    reply.save().then(resp => {
      res.status(201).json({
        message: reply
      });
    });

}

exports.replyGet = (req, res, next) => {
    Reply.find()
      .then(documents => {
          if(documents.length > -1) {
              res.status(201).json({
                  message: 'reply retrieved successfully',
                  reply: documents,
                });
              } else {
                  res.status(500).json({
                      message: 'There are no replies to message'
                  });
              }      
      });  
    }

    exports.replyDelete = (req, res, next) => {
        console.log(req.params.id);
        Reply.deleteOne({ _id: req.params.id }).then(result => {
          if (result.n > 0) {
            res.status(200).json({message: 'Reply Deleted successful'});
          } else {
            res.status(401).json({message: 'Not authorized!...Ugggh'});
          }
        });
      }