const nodemailer = require("nodemailer")

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER,
                pass: process.env.PASS, // Use the App Password
            },
        });

        const info = await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email sent successfully:", info.response);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};
