const mongoose = require('mongoose');

const Review = new mongoose.Schema(
    {
        reviewed_by: {type: String, required: true},
        review_for: {type: String, required: true},
        review: {type: String, required: true},
        rating: {type: Number, required: true},
    },{
        collection: 'review'
    }
)

const model = mongoose.model('review', Review);

module.exports = model;