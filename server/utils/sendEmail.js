const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY, 
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { 
          name: "SA-Cart", 
          email: process.env.BREVO_USER 
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }

    console.log("Email sent successfully via Brevo API:", data.messageId);
    return data;

  } catch (error) {
    console.error("Brevo API Error:", error.message);
    throw error;
  }
};

export default sendEmail;