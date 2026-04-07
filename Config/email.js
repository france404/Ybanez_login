const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendWelcomeEmail = async (email, name) => {
    console.log("Sending email...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", process.env.EMAIL_PASS ? "YES" : "NO");

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account Created Successfully",
        html: `<h2>Welcome, ${name}!</h2>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("FULL ERROR:", error);
    }
};

module.exports = { sendWelcomeEmail };