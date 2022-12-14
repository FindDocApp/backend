const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, required: true},
        profileImage: {type: String}
    },{
        collection: 'user'
    }
)

const model = mongoose.model('user', User);

module.exports = model;