const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const likeSchema = mongoose.Schema({
    likes: { type: Array, required: true, unique: true }    
});

likeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Like', likeSchema);
