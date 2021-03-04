const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembersSchema = new Schema({
    memberID: {
        type: String,
        lowercase: true
    },
    fullname: {
        type: String,
        lowercase: true
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('members', MembersSchema);