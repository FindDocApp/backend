require("dotenv").config();
const { options, sendMail } = require("../../utils/nodemailer");

const contactForm = async (req, res) => {
  const { email, name, message, subject } = req.body;

  if (!email || !name || !message || !subject) {
    return res.json({ status: "error", error: "Missing data" });
  }

  // Messages sent using FindDoc's contact form will be sent to FindDoc's email
  const toEmail = process.env.EMAIL;

  // Format email template
  let formattedSubject = `New message submitted by FindDoc\'s contact form | ${subject}`
  let emailBody = `${message}\n\nSubmitted by: ${name}\nEmail: ${email}`

  // Get email data object
  const emailData = options(toEmail, toEmail, formattedSubject, emailBody)
  // Send email
  const response = sendMail(emailData);

  if (response.status !== "ok") {
    return res.json({ status: "error", error: response.error });
  }

  return res.json({ status: "ok" });
};

module.exports = contactForm;