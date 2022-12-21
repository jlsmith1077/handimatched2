const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
    content1: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    mailId: { type: String, required: true },
    username: { type: String, required: true },
    receivername: { type: String, required: true },
    messageTime: { type: String, required: true }
});

module.exports = mongoose.model('Reply', replySchema);