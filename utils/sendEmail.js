const nodemailer = require("nodemailer");

module.exports = async (email, subject, htmlTemplate) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    await transporter.sendMail({
      from: `${process.env.USER}`,
      to: email,
      subject: subject,
      html: htmlTemplate,
    });
    console.log("Email sent successfully");
    return true
  } catch (error) {
    console.error("Error sending email:", error.message);
    return false;    
  }
};
