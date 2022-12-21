const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const dislikeSchema = mongoose.Schema({
    dislikes: { type: Array, required: true, unique: true }    
});

dislikeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Dislike', dislikeSchema);