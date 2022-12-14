const appointmentModel = require("../../models/appointment.model");

const rescheduleAppointment = async (req, res) => {
  const { appointment_id, date } = req.body;

  if (!appointment_id || !date ){
    return res.json({ status: "error", error: "Missing data" });
  }

  try {
    // Updating appointment data using given appointment id
    await appointmentModel.updateOne({_id: appointment_id}, {$set: {date}});

    return res.json({ status: "ok" });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = rescheduleAppointment;