import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
   
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true,
      pool: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"SA-Cart" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: ", info.messageId);
    return info;

  } catch (error) {
   
    console.error("Nodemailer Detailed Error:", error);
    throw error;
  }
};

export default sendEmail;