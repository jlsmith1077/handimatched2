const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const profileSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true  },
    location: { type: String },
    fullname: { type: String },
    email: { type: String, required: true },
    gender: { type: String },
    interest: { type: String },
    imagePath: { type: String },
    creator: { type: String, ref:'User', required: true },
    friends: { type: Array },
    friendsAmt: { type: Number, default: 0},
    imageGallery: {type: [{
        title: {type: String},
        path: {type: String, required: true},
        likes: {type: Number}
    }]},
    videoGallery: {type: [{
        title: {type: String},
        path: {type: String, required: true},
        likes: {type: Number}
    }]}
});

profileSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Profile', profileSchema);