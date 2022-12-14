const userModel = require("../../models/user.model");
const specialityModel = require("../../models/speciality.model");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  const { id, username, speciality, confirmPassword, profileImage } = req.body;

  if (!id || !username  || !confirmPassword) {
    return res.json({ status: "error", error: "Missing fields" });
  }

  // Check if user exists
  let user = await userModel.findOne({ _id: id });
  if (!user) {
    return res.json({
      status: "error",
      error: "Could not find user",
    });
  }

  // Check if given password matches user password
  const isCorrectPassword = await bcrypt.compare(
    confirmPassword,
    user.password
  );
  if (!isCorrectPassword) {
    return res.json({ status: "error", error: "Incorrect password" });
  }


  try {
    // Update username if changed
    if (username !== user.username) {
      user.username = username;
    }

    // Update user profile image if changed
    if (profileImage) {
        user.profileImage = profileImage;
    }

    // Save changes
    user.save();

    // If user is a doctor, update the doctor's speciality if changed
    let doctor = undefined;
    if (user.role === "doctor") {
      // Getting the doctor's current set speciality
      const currentSpeciality = await specialityModel.findOne({
        doctor_id: user.id,
      });

      // Checking if given speciality matches current speciality
      if (!currentSpeciality || currentSpeciality.speciality !== speciality) {
        if(speciality.trim() === ''){
          return res.json({ status: "error", error: 'Speciality is required' });
        }
        // Update and save changes if speciality is changed
        currentSpeciality.speciality = speciality;
        currentSpeciality.save();
      }

      doctor = {
        ...user._doc,
        speciality: currentSpeciality ? currentSpeciality.speciality : "",
      };
    }

    user = doctor ? doctor : user;

    return res.json({ status: "ok", user });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = updateUser;
