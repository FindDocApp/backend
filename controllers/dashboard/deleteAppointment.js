const appointmentModel = require("../../models/appointment.model");

const deleteAppointment = async (req, res) => {
  const { appointment_id } = req.body;

  if (!appointment_id ){
    return res.json({ status: "error", error: "Missing data" });
  }

  try {
    // Delete appointment from appointment model 
    await appointmentModel.deleteOne({_id: appointment_id});

    return res.json({ status: "ok" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = deleteAppointment;