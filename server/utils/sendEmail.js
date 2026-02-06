import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => { 
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, 
            },
        });

        await transporter.sendMail({
            from: `"SA-Cart" <${process.env.EMAIL_USER}>`,
            to: to, 
            subject: subject,
            html: html
        });

        console.log("Email sent successfully to:", to);
    } catch (error) {
        console.log("Email Error:", error.message);
        console.log("Error Details:", error);
    }
};

export default sendEmail;