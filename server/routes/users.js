const router = require("express").Router();
const { User, validateSignup } = require("../models/user"); // Updated import!
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    try {
        const { error } = validateSignup(req.body); // Updated validation function
        if (error) return res.status(400).send({ message: error.details[0].message });

        const { firstName, lastName, email, password, phone } = req.body;

        // 🔹 Find an existing phone-verified user
        let user = await User.findOne({ phone });

        if (!user || !user.mobileNumberVerified) {
            return res.status(400).send({ message: "Phone number not verified. Please verify OTP first." });
        }

        // 🔹 Check if the email is already in use by another user
        let existingEmailUser = await User.findOne({ email });
        if (existingEmailUser && existingEmailUser._id.toString() !== user._id.toString()) {
            return res.status(409).send({ message: "User with this email already exists!" });
        }

        // 🔹 Hash password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(password, salt);

        // 🔹 Update user details
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = hashPassword;
        await user.save();

        // ✅ Send email verification
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}/api/users/${user._id}/verify/${token.token}`;
        await sendEmail(email, "Verify Email", `Click this link to verify your email: ${url}`);

        res.status(201).send({ message: "Signup complete. Verify your email to proceed." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Email verification route (Ensure this exists in routes/users.js)
router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send({ message: "Invalid or expired link" });

        const token = await Token.findOne({ userId: user._id, token: req.params.token });
        if (!token) return res.status(400).send({ message: "Invalid or expired token" });

        // ✅ Mark the user as email verified
        user.verified = true;
        await user.save();

        // ✅ Remove verification token
        await Token.deleteOne({ _id: token._id });

        res.status(200).send({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        console.error("Email Verification Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



module.exports = router;
