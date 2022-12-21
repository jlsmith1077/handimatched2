const Mail = require("../models/mail");

exports.mailCreate = (req, res, next) => {
    const mail = new Mail({
      content1: req.body.content1,
      creator: req.body.creator,
      receiver: req.body.receiver,
      username: req.body.username,
      receivername: req.body.receivername,
      messageTime: req.body.messageTime,
      userpic: req.body.userpic,
      opened: req.body.opened
    });
    mail.save()
    .then(result => {
      res.status(201).json({
          message: 'User created',
          result: result
      });
  })
  .catch(err => {
      res.status(500).json({
              message: 'Please create a profile'
      });
  });

}

exports.mailGet = (req, res, next) => {
    Mail.find()
      .then(documents => {
        res.status(201).json({
          message: 'mail retrieved successfully',
          mail: documents,
        });
      });  
    }

exports.mailUpdate = (req, res, next) => {
    Mail.updateOne({ _id: req.params.id }, {$set: {"opened": "true"}})
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Mail Updated successful'});  
      } else {
        res.status(401).json({message: 'Something went wrong...Ugggh!'});
      }
    });
}
exports.replyUpdate = (req, res, next) => {
  console.log('mail state', req.params.id)
    Mail.updateOne({ _id: req.params.id }, {$set: {"opened": "false"}}).then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Mail Updated successful'});  
      } else {
        res.status(401).json({message: 'Not authorized!...Ugggh'});
      }
    });
}

exports.mailDelete = (req, res, next) => {
    console.log(req.params.id);
    Mail.deleteOne({ _id: req.params.id }).then(result => {
      if (result.n > 0) {
        res.status(200).json({message: 'Mail Deleted successful'});
      } else {
        res.status(401).json({message: 'Not authorized!...Ugggh'});
      }
    });
  }