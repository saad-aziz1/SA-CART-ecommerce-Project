import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com", 
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"SA-Cart" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

   
    return await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Email Error inside sendEmail.js:", error);
    
    throw error; 
  }
};

export default sendEmail;