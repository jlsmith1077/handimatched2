const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const SocialuserSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    socialId: { type: String, required: true }    
});

SocialuserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Socialuser', SocialuserSchema);
