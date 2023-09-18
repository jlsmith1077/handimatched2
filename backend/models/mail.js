const mongoose = require('mongoose');
const reply = require('./reply')

const mailSchema = mongoose.Schema({
    content1: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    receiverCreator: { type: String, required: true },
    username: { type: String, required: true },
    receivername: { type: String, required: true },
    messageTime: { type: String, required: true },
    userpic: { type: String, required: true },
    messageImages: { type: Array },
    messageVideo: { type: String },
    opened: {type: String, required: true},
});

module.exports = mongoose.model('Mail', mailSchema);