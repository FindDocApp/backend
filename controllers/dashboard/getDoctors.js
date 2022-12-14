const userModel = require("../../models/user.model");
const specialityModel = require("../../models/speciality.model");
const reviewModel = require("../../models/review.model");

const getDoctors = async (req, res) => {
    try{
        let reviews = await reviewModel.find();
        let users = await userModel.find()
        let specialities = await specialityModel.find();

        // Getting all users that are doctors 
        let doctors = users.filter(user => user.role === 'doctor')

        // Adding the speciality and reviews of each doctor to the returned doctor object
        doctors = doctors.map(doctor => {
            // Getting doctor speciality
            let speciality = specialities.filter(speciality => speciality.doctor_id === doctor.id)

            // Getting doctor reviews
            reviews = reviews.filter(review => review.review_for === doctor.id)
            reviews = reviews.map(review => {
                let reviewedBy = users.filter(user => user.id === review.reviewed_by)[0]
                
                return {
                    ...review._doc,
                    reviewed_by: reviewedBy.username
                }
            })

            // Adding speciality and reviews to the doctor data object
            return speciality.length === 0 ? doctor : {
                ...doctor._doc,
                speciality: speciality[0].speciality,
                reviews
            }
        })
        
        // Only returning doctors who has their speciality added to the client side (frontend)
        doctors = doctors.filter(doctor => doctor.speciality && doctor.speciality !== '')
        
        return res.json({ status: 'ok', doctors })
    }catch(error){
        return res.json({ status: 'error', error: 'Invalid token' })
    }
};

module.exports = getDoctors;