import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./index.css"

const MobileVerification = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Send OTP request
    const sendOtp = async () => {
        try {
            const { data } = await axios.post("http://localhost:8080/api/send-otp", { phone });
            setOtpSent(true);
            setError("");
            alert("OTP sent successfully!");
        } catch (error) {
            setError(error.response?.data?.message || "Failed to send OTP");
        }
    };

    // Verify OTP request
    const verifyOtp = async () => {
        try {
            const { data } = await axios.post("http://localhost:8080/api/verify-otp", { phone, otp });
            alert("OTP verified successfully!");
            localStorage.setItem("verifiedPhone", phone);
            navigate("/signup"); // Move to Signup Screen
        } catch (error) {
            setError(error.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="mobile-bg">
            <div className="card">
            <h2 className="mobile-head">Mobile Verification</h2>
            {!otpSent ? (
                <>
                    <input
                        type="text"
                        placeholder="Enter mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input"
                    />
                    <button onClick={sendOtp} className="green_btn">Send OTP</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="input"
                    />
                    <button onClick={verifyOtp} className="green_btn">Verify OTP</button>
                </>
            )}
            <div className="t">
               {error && <p className="error_msg">{error}</p>}
            </div>
            </div>
        </div>
    );
};

export default MobileVerification;
