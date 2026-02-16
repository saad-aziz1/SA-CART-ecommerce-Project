import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Port 587 for STARTTLS
      secure: false, // TLS ke liye false hona chahiye
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Aapka 16-character App Password
      },
      tls: {
        rejectUnauthorized: false // Ye production par self-signed certificate errors ko handle karta hy
      }
    });

    const mailOptions = {
      from: `"SA-Cart" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Result:", info.response);
    return info;

  } catch (error) {
    console.error("Gmail Production Error:", error);
    throw error;
  }
};

export default sendEmail;