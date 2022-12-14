const appointmentModel = require("../../models/appointment.model");

const confirmAppointment = async (req, res) => {
  const { appointment_id } = req.body;

  if (!appointment_id){
    return res.json({ status: "error", error: "Missing data" });
  }

  try {
    // Setting appointment status to confirmed
    await appointmentModel.updateOne({_id: appointment_id}, {$set: {confirmed: true}});

    return res.json({ status: "ok" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = confirmAppointment;