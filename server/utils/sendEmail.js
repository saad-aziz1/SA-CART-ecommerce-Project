import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.BREVO_USER, 
        pass: process.env.BREVO_API_KEY, 
      },
    });

    const mailOptions = {
      from: `"SA-Cart" <${process.env.BREVO_USER}>`, 
      to: to,
      subject: subject,
      html: html,
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Brevo:", info.messageId);
    return info;

  } catch (error) {
    console.error("Brevo SMTP Error:", error);
    throw error;
  }
};

export default sendEmail;