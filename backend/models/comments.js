const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    comment: { type: String },
    commentor: { type: String },
    postId: {type: String}
});

module.exports = mongoose.model('Comments', commentsSchema);