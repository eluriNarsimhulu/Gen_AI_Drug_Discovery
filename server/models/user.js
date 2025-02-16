const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, sparse: true }, // Sparse allows NULL values
    password: { type: String },
    phone: { type: String, required: true, unique: true },
    mobileNumberVerified: { type: Boolean, default: false }, // ✅ OTP verified
    verified: { type: Boolean, default: false }, // ✅ Email verified
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

const validateSignup = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
        phone: Joi.string().required(), // ✅ Add phone validation
    });
    return schema.validate(data);
};

module.exports = { User, validateSignup };
