const mongoose = require('mongoose');

const disabilitySchema = mongoose.Schema({
    Physical: { type: String },
    SpinalCord: { type: String },
    HeadInjuries: { type: String },
    Vision: { type: String },
    Hearing: { type: String },
    CognitiveLearning: { type: String },
    Psychological: { type: String },
    Invisible: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('disability', disabilitySchema);