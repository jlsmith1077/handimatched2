const Disability = require('../models/disability');

exports.disabilityCreate = (req, res, next) => {
    const disability = new Disability({
        Physical: req.body.Physical,
        SpinalCord: req.body.SpinalCord,
        HeadInjuries: req.body.HeadInjuries,
        Vision: req.body.Vision,
        Hearing: req.body.Hearing,
        CognitiveLearning: req.body.CognitiveLearning,
        Psychological: req.body.Psychological,
        Invisible: req.body.Invisible,
        creator: req.userData.userId,
    });
    disability.save().then(createdDisability => {
        res.status(201).json({
            message: 'Disability added successfully!',
            disability: {
                ...createdDisability,
                id: createdDisability._id
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating disability failed!'
        });
    });
}

    exports.disabilityGet = (req, res, next) => {
        Disability.find()
            .then(documents => {
                res.status(201).json({
                    message: 'disability retrieved successfully!',
                    disability: documents,
                });
            });
        }
        exports.disabilityDelete = (req, res, next) => {
            Disability.deleteOne({ _id: req.params.id }).then(result => {
              if (result.n > 0) {
                res.status(200).json({message: 'disability Deleted successful'});
              } else {
                res.status(401).json({message: 'Not authorized to delete!...Ugggh'});
              }
            });
        }