import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => { // <--- Yahan { to, subject, html } likhein
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // App Password
            },
        });

        await transporter.sendMail({
            from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
            to: to, // <--- Ab ye sahi 'to' uthayega
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