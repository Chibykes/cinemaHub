const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
    ticketID: { type: String, lowercase: true },
    movieID: { type: String, lowercase: true },
    memberID: { type: String, lowercase: true },
    showingDate: { type: String, lowercase: true },
    showingTime: { type: String, lowercase: true },
    showingHall: { type: String, lowercase: true },
    date_time: {
        type: Number
    },
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('reservations', ReservationsSchema);