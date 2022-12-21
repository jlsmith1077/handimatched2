const mongoose = require('mongoose');

const mailSchema = mongoose.Schema({
    content1: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    receiver: { type: String, required: true },
    username: { type: String, required: true },
    receivername: { type: String, required: true },
    messageTime: { type: String, required: true },
    userpic: { type: String, required: true },
    opened: {type: String, required: true},
    repliesAmt: { type: Number, default: 0},
});

module.exports = mongoose.model('Mail', mailSchema);