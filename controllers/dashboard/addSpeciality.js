const userModel = require("../../models/user.model");
const specialityModel = require("../../models/speciality.model");

const addSpeciality = async (req, res) => {
  const { speciality, doctor_id } = req.body;

  if (!speciality || !doctor_id) {
    return res.json({ status: "error", error: "Missing fields" });
  }

  // Search for user
  const doctor = await userModel.findOne({ _id: doctor_id });
  if (!doctor) {
    return res.json({ status: "error", error: "User not found" });
  }

  // Check if the doctor has already added their speciality
  const specialityExists = await specialityModel.find({ doctor_id: doctor_id });
  if (specialityExists.length > 0) {
    return res.json({ status: "continue", error: "Speciality was added already" });
  }

  try {
    // Adding doctor speciality
    const doctor_speciality = await specialityModel.create({
      speciality,
      doctor_id,
    });

    return res.json({ status: "ok", speciality: doctor_speciality.speciality });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = addSpeciality;
