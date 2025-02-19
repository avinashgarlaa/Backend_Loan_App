require('dotenv').config();  // Make sure to load .env file

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes"); // Double-check this path

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Register routes
console.log("Routes loaded:", authRoutes);  // Debugging log
console.log("Is authRoutes a function?", typeof authRoutes === 'function'); // Log if it's a function
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
