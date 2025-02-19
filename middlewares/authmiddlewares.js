const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

// Register User with Phone Number & Password
const register = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Phone number and password are required" });
        }

        let user = await User.findOne({ phoneNumber });
        if (user) return res.status(400).json({ message: "Phone number already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ phoneNumber, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login User with Phone Number & Password
const login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Phone number and password are required" });
        }

        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ message: "Invalid phone number or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid phone number or password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { register, login };
