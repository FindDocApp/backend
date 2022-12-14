const appointmentModel = require("../../models/appointment.model");

const bookAppointment = async (req, res) => {
  const { reason, date, bookedDoctor, bookedBy } = req.body;

  if (!reason || !date || !bookedDoctor || !bookedBy) {
    return res.json({ status: "error", error: "Missing fields" });
  }

  try {
    // Adding new appointment
    const appointment = await appointmentModel.create({
        reason,
        date,
        booked_for: bookedDoctor,
        booked_by: bookedBy,
        confirmed: false
    });

    return res.json({ status: "ok", appointment });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = bookAppointment;