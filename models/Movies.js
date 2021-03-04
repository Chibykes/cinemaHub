const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoviesSchema = new Schema({
    movieID: {
        type: String,
        trim: true
    },
    title: {
        type: String,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        trim: true
    },
    genre: {
        type: String,
        trim: true
    },
    cast: {
        type: Array
    },
    showingTime: {
        type: Array
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    price: {
        type: Number
    },
    date_time: {
        type: Number
    }
});

module.exports = mongoose.model('movies', MoviesSchema);