const userModel = require("../../models/user.model");
const appointmentModel = require("../../models/appointment.model");
const reviewModel = require("../../models/review.model");

const getOverviewContent = async (req, res) => {
    const { id, role } = req.query;

    if(!id){
        return res.json({ status: 'error', error: 'Missing data' })
    }

    try{
        let reviews = []
        let bookings = []
        let appointments = []
        let users = await userModel.find()

        // If user is a:
        // doctor: return appointments for the doctor,  bookings for the doctor, doctor reviews
        // patient: return appointments by the patient,  bookings by the patient
        if(role === 'doctor'){
            // Get doctor appointmetns
            appointments = await appointmentModel.find({booked_for: id, confirmed: true});
            appointments = appointments.map( appointment => {
                let bookedBy = users.filter(user => user.id === appointment.booked_by)[0];
                
                return {
                    ...appointment._doc,
                    user: bookedBy
                }
            })
            
            // Get doctor bookings
            bookings = await appointmentModel.find({booked_for: id, confirmed: false});
            bookings = bookings.map( booking => {
                let bookedBy = users.filter(user => user.id === booking.booked_by)[0];
                
                return {
                    ...booking._doc,
                    user: bookedBy
                }
            })
            
            // Get doctor reviews
            reviews = await reviewModel.find({review_for: id}); 
            reviews = reviews.map(review => {
                let reviewedBy = users.filter(user => user.id === review.reviewed_by)[0]
                
                return {
                    ...review._doc,
                    reviewed_by: reviewedBy.username
                }
            })
        }else{
            // Get patient appointments
            appointments = await appointmentModel.find({booked_by: id, confirmed: true});
            appointments = appointments.map( appointment => {
                let bookedFor = users.filter(user => user.id === appointment.booked_for)[0];

                return {
                    ...appointment._doc,
                    user: bookedFor
                }
            })
            
            // Get patient bookings
            bookings = await appointmentModel.find({booked_by: id, confirmed: false});
            bookings = bookings.map( (booking, i) => {
                let bookedFor = users.filter(user => user.id === booking.booked_for)[0];

                return {
                    ...booking._doc,
                    user: bookedFor
                }
            })
        }

        let content = role === 'doctor' ? {
            appointments,
            bookings,
            reviews
        } : {
            appointments,
            bookings
        }

        return res.json({ status: 'ok', content })
    }catch(error){
        console.log(error)
        return res.json({ status: 'error', error: 'Invalid token' })
    }
};

module.exports = getOverviewContent;