const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Optional: verify once (does NOT block server)
transporter.verify((error) => {
  if (error) {
    console.error("❌ Gmail configuration failed:", error.message);
  } else {
    console.log("✅ Gmail ready to send emails");
  }
});

const sendEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial;">
      <h2>🔐 ChatApp Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p>Do not share this with anyone.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `ChatApp <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ChatApp OTP Verification",
      html
    });
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw new Error("Email service failed");
  }
};

module.exports = sendEmail;
