require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/user.model");

const resetPassword = async (req, res) => {
  const { id, password, token } = req.body;

  // Check if user is registered
  const user = await userModel.findOne({ _id: id });

  if (!user) {
    return res.json({ status: "error", error: "User not found" });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);
  const secret = process.env.JWT_SECRET_TOKEN + user.password;

  try {
    jwt.verify(token, secret);

    // Update / Change user password
    await userModel.updateOne(
      { id: id, email: user.email },
      { $set: { password: hashedPassword } }
    );

    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error)
    return res.json({ status: "error", error: "Password reset link expired" });
  }
};

module.exports = resetPassword;