const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    username: { type: String, required: true },
    title: { type: String, required: true },
    videoPath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

module.exports = mongoose.model('Video', videoSchema);