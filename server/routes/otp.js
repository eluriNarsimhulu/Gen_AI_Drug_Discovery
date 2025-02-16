const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const dotenv = require("dotenv");

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const otpStorage = {}; // Temporary storage for OTPs (Use Redis/DB in production)

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
    const { phone } = req.body;

    if (!phone) return res.status(400).send({ message: "Phone number is required" });

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        otpStorage[phone] = otp; // Store OTP temporarily

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        res.status(200).send({ message: "OTP sent successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error sending OTP" });
    }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) return res.status(400).send({ message: "Phone and OTP are required" });

    if (otpStorage[phone] === otp) {
        delete otpStorage[phone]; // Remove OTP after successful verification
        res.status(200).send({ message: "OTP verified successfully!" });
    } else {
        res.status(400).send({ message: "Invalid OTP" });
    }
});

module.exports = router;
