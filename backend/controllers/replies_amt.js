const Mail = require("../models/mail");

exports.repliesAmt = (req, res, next) => {
    console.log('replies amt', req.body.mailId);
    const mailQuery = Mail.find();
    let fetchedMails;
    Mail.updateOne({_id: req.body.mailId},
       {$inc: {repliesAmt: 1}
       }).then(mailQuery.then(documents => {
        fetchedMails = documents;
        return fetchedMails;
      })) 
.then(result => {
    if (result.n > 0) {
    res.status(200).json({ message: 'Update successful!', 
                           mails: fetchedMails
                            });  
  } else {
    res.status(401).json({message: 'Not authorized'});
    }
  }).catch(error => {
            console.log(error);
            res.status(500).json({
            message: 'Was not able to update profile '
        })
      });
}
