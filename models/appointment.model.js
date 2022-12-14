const mongoose = require('mongoose');

const Appointment = new mongoose.Schema(
    {
        booked_for: {type: String, required: true},
        booked_by: {type: String, required: true},
        date: {type: String, required: true},
        reason: {type: String, required: true},
        confirmed: {type: Boolean, required: true}
    },{
        collection: 'appointment'
    }
)

const model = mongoose.model('appointment', Appointment);

module.exports = model;