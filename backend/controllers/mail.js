const Mail = require("../models/mail");
const jwt = require('jsonwebtoken');

exports.mailCreate = (req, res, next) => {
  let images = req.files;
  const url = req.protocol + "://" + req.get("host");
  let messageImages = [];
  for (let index = 0; index < images.length; index++) {
    messageImages.push(url + "/messagemedia/" + images[index].filename); 
    console.log('images', messageImages)
  }
  console.log('messageImages',messageImages)
    const mail = new Mail({
      content1: req.body.content1,
      creator: req.body.creator,
      receiverCreator: req.body.receiverCreator,
      username: req.body.username,
      receivername: req.body.receivername,
      messageTime: req.body.messageTime,
      userpic: req.body.userpic,
      messageImages: messageImages,
      messageVideo: req.body.messageVideo,
      opened: 'false'
    });
    mail.save()
    .then(result => {
      res.status(201).json({
          message: 'User created',
          result: result
      });
  })
  .catch(err => {
    console.log('error message', err)
      res.status(500).json({
              message: 'Please create a profile'
      });
  });

}

exports.mailGet = (req, res, next) => {
    const id = req.userData.userId;
    const getMail = Mail.find( { $or: [ { receiverCreator: id }, { creator: id } ] } )
    let mail
    getMail.then(documents => mail = documents).then(documents => {
      res.status(200).json({
        message: 'You Have Mail',
        mail: documents
      })
    }).
      catch(err => {
        console.log('error', err);
        const message = err;
        res.status(500).json({
          message: message
        })
      })
      ;  
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