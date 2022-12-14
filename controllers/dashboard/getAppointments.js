const userModel = require("../../models/user.model");
const appointmentModel = require("../../models/appointment.model");

const getAppointments = async (req, res) => {
    const { id, role } = req.query;
    
    if(!id || !role){
        return res.json({ status: 'error', error: 'Missing data' })
    }

    try{
        let appointments = []
        let users = await userModel.find()

        if(role === 'doctor'){
            // Search for appointments booked for the doctor, with the 'confirmed' field set to true 
            appointments = await appointmentModel.find({booked_for: id, confirmed: true});
            appointments = appointments.map( appointment => {
                // Getting user data(image, username) of each patient that booked an appointment  
                let bookedBy = users.filter(user => user.id === appointment.booked_by)[0];
                
                return {
                    ...appointment._doc,
                    user: bookedBy
                }
            })
        }else{
            // Search for appointments booked by the patient, with the 'confirmed' field set to true 
            appointments = await appointmentModel.find({booked_by: id, confirmed: true});
            appointments = appointments.map( appointment => {
                // Getting user data(image, username) of each doctor that the patient booked an appointment for
                let bookedFor = users.filter(user => user.id === appointment.booked_for)[0];

                return {
                    ...appointment._doc,
                    user: bookedFor
                }
            })
        }

        return res.json({ status: 'ok', appointments })
    }catch(error){
        return res.json({ status: 'error', error: 'Invalid token' })
    }
};

module.exports = getAppointments;