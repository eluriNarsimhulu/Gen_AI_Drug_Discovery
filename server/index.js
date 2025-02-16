require('dotenv').config();
const express = require('express')
const app = express();
const cors = require('cors');
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");


// database connection
connection();

// middilwares
app.use(express.json())
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);


// Add OTP Routes
app.use("/api", otpRoutes);

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Listing port is ${port}...`))