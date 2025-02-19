const bcrypt = require("bcryptjs");
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");

// Register User with Phone Number & Password
const register = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Validate required fields
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Phone number and password are required" });
        }

        // Check if phone number is already registered
        let user = await User.findOne({ phoneNumber });
        if (user) return res.status(400).json({ message: "Phone number already registered" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with only required fields
        user = new User({
            phoneNumber,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully", user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User with Phone Number & Password
const login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        // Validate input fields
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Phone number and password are required" });
        }

        // Check if user exists with phone number
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ message: "Invalid phone number or password" });

        // Compare password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid phone number or password" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Send response with the token
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Export both functions at once
module.exports = { register, login };
