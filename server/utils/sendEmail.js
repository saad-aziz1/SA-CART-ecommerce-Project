import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      // Port change
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
      },
      
      connectionTimeout: 10000, 
    });

    const mailOptions = {
      from: `"SA-Cart" <${process.env.BREVO_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Result:", info.response);
    return info;

  } catch (error) {
    
    console.error("Brevo Connection Error:", error);
    throw error;
  }
};

export default sendEmail;