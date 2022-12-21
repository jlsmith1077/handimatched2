const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const friendSchema = mongoose.Schema({
    friends: { type: Array, required: true, unique: true }    
});

friendSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Friend', friendSchema);