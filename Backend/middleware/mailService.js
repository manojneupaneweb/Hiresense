import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"TechSphere" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendMail;