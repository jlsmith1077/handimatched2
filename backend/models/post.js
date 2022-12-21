const mongoose = require('mongoose');
const Comments = require('../models/comments');
const Like = require('../models/like');
const Dislike = require('../models/dislike');

const postSchema = mongoose.Schema({
    username: { type: String, required: true },
    messagepost: { type: String, required: true },
    imagePath: { type: String },
    format: { type: String },
    section: { type: String },
    time: { type: String },
    title: { type: String },
    privacy: { type: String },
    location: { type: String },
    userPic: {type: String},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes:  { type: Array },
    likesAmt: {type: Number, default: 0},
    dislikes:  { type: Array },
    dislikesAmt: {type: Number, default: 0},
    comments: {type: [{
        comment: {type: String},
        commentor: {type: String}
    }]}
});

module.exports = mongoose.model('Post', postSchema);