const userModel = require("../../models/user.model");
const reviewModel = require("../../models/review.model");

const getReviews = async (req, res) => {
    const { id } = req.query;
    
    if( !id ){
        return res.json({ status: 'error', error: 'Missing data' })
    }

    try{
        // Get doctor reviews
        let reviews = await reviewModel.find({review_for: id}); 
        let users = await userModel.find()
        
        reviews = reviews.map(review => {
            // Adding the data(username) of each patient that submitted a doctor review
            let reviewedBy = users.filter(user => user.id === review.reviewed_by)[0]
            
            return {
                ...review._doc,
                reviewed_by: reviewedBy.username
            }
        })

        return res.json({ status: 'ok', reviews })
    }catch(error){
        return res.json({ status: 'error', error: 'Invalid token' })
    }
};

module.exports = getReviews;