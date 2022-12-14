require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const specialityModel = require("../../models/speciality.model");
const userModel = require("../../models/user.model");

const signIn = async (req, res) => {
  const { email, password, role } = req.body;

  if (!password || !email || !role) {
    return res.json({ status: "error", error: "Missing fields" });
  }

  // Check if user email with given role is registered
  let user = await userModel.findOne({ email, role });

  if (!user) {
    return res.json({
      status: "error",
      error: "Could not find an account connected to this email and role",
    });
  }

  // Check is given password matches user passwod
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.json({ status: "error", error: "Incorrect password" });
  }

  try {
    const secret = process.env.JWT_SECRET_TOKEN;
    const token = jwt.sign({ email }, secret);

    // If user signing in is a doctor, add the doctor speciality to the user data returned to client side (frontend)
    let doctor = undefined
    if (user.role === "doctor") {
      const speciality = await specialityModel.findOne({ doctor_id: user.id });

      doctor = {
        ...user._doc,
        speciality: speciality ? speciality.speciality : "",
      };
    }

    user = doctor ? doctor : user
    
    return res.json({ status: "ok", token, user });
  } catch (error) {
    console.log(error)
    return res.json({ status: "error", error: "Invalid token" });
  }
};

module.exports = signIn;
