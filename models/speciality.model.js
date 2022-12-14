const mongoose = require('mongoose');

const Speciality = new mongoose.Schema(
    {
        doctor_id: {type: String, required: true, unique: true},
        speciality: {type: String, required: true}
    },{
        collection: 'speciality'
    }
)

const model = mongoose.model('speciality', Speciality);

module.exports = model;