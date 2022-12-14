require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/user.model");

const register = async (req, res) => {
  const { email, username, password, role, profileImage } = req.body;

  if(!password || !email || !role || !username){ 
    return res.json({ status: "error", error: 'Missing fields' });
  }
  
  // Search if email is already in use
  const matchingEmails = await userModel.find({ email });

  if(matchingEmails.length > 0){
      return res.json({ status: "error", error: 'This email is already taken' });
  }

  // Hashing user password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Creating new user
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
      role,
      profileImage
    });

    // Signing user authentication token 
    const secret = process.env.JWT_SECRET_TOKEN;
    const token = jwt.sign({ email }, secret);

    return res.json({ status: "ok", token, user });
  } catch (error) {
    return res.json({ status: "error", error: error.message });
  }
};

module.exports = register;