const express = require("express");
// const router = express.Router();
const router = require("express").Router();
const twilio = require("twilio");
const dotenv = require("dotenv");
const { User } = require("../models/user");

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStorage = {}; // Temporary storage for OTPs

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
    const { phone } = req.body;

    if (!phone) return res.status(400).send({ message: "Phone number is required" });

    try {
        // 🔹 Check if the phone number is already in use
        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).send({ message: "This phone number is already registered. Please use a different number or log in." });
        }

        // 🔹 Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage[phone] = otp; // Store OTP temporarily

        // Send OTP via Twilio
        await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        res.status(200).send({ message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).send({ message: "Error sending OTP" });
    }
});


// ✅ Verify OTP & Update User in Database
router.post("/verify-otp", async (req, res) => {
    const { phone, otp } = req.body;

    // 🔹 Check if the OTP exists for this phone number
    if (!otpStorage[phone]) {
        return res.status(400).send({ message: "No OTP request found for this number" });
    }

    // 🔹 Compare user input OTP with stored OTP
    if (otpStorage[phone] !== otp) {
        return res.status(400).send({ message: "Invalid OTP" });
    }

    try {
        let user = await User.findOne({ phone });

        if (!user) {
            // ✅ Create a new user with only phone number (mobile verified)
            user = new User({
                phone,
                mobileNumberVerified: true,
            });
            await user.save();
        } else {
            // ✅ Update existing user
            user.mobileNumberVerified = true;
            await user.save();
        }

        // 🔹 Remove OTP after successful verification
        delete otpStorage[phone];

        res.status(200).send({ message: "Phone number verified successfully!" });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
module.exports = router;
