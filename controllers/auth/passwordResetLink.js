require('dotenv').config();
const userModel = require("../../models/user.model");
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRY_TIME = "30m";

const passwordResetLink = async (req, res) => {
    const {email} = req.body;

    // Get user from database
    const user = await userModel.findOne({ email: email });

    if (!user) {
        return res.json({ status: 'error', error: 'Could not find account. Check your email for spelling errors and try again.' });
    }

    const id = user.id;

    // Signing reset link's token and settnig the expiry time
    const secret = process.env.JWT_SECRET_TOKEN + user.password;
    const payload = {email, id};
    const token = jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRY_TIME});

    // The below link can be used ones to reset the user password before the the link expires
    const link = getPasswordResetLink(req, id, token);
    
    return res.json({status: 'ok', link});
}

// Returns the password reset link after setting the frontend host
const getPasswordResetLink = (req, id, token) => {
    const CMS_HOST = process.env.CMS_HOST;
    
    return `${req.protocol}://${CMS_HOST}#/auth/change-password/${id}/${token}`;
}

module.exports = passwordResetLink