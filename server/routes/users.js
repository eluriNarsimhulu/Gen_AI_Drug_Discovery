
const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User with given email already exists!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // ✅ Save user but keep `verified: false`
        user = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            verified: false, // ❌ Not verified yet
        }).save();

        // ✅ Generate a verification token
        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        // ✅ Send verification email
        const url = `${process.env.BASE_URL}api/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", `Click this link to verify your email: ${url}`);

        res.status(201).send({ message: "An email has been sent to your account. Please verify to complete registration." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// ✅ Email verification route
router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send({ message: "Invalid or expired link" });

        const token = await Token.findOne({ userId: user._id, token: req.params.token });
        if (!token) return res.status(400).send({ message: "Invalid or expired token" });

        // ✅ Update the user to verified
        user.verified = true;
        await user.save();

        // ✅ Remove token after successful verification
        await Token.deleteOne({ _id: token._id });

        res.status(200).send({ message: "Email verified successfully! You can now log in." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
