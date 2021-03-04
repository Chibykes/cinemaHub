const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AudiosSchema = new Schema({
    audioID: {
        type: String,
        lowercase: true
    },
    audioPoster: {
        type: String,
        lowercase: true
    },
    audioTitle: {
        type: String,
        lowercase: true
    },
    audioSize: {
        type: Number,
    },
    audioType:{
        type: String,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('audios', AudiosSchema);