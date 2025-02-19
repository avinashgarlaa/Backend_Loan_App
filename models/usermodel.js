const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true }, // Login with phone
    password: { type: String, required: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: false },
    dob: { type: Date, required: false },
    panNumber: { type: String, required: false, unique: true, sparse: true },
    maritalStatus: { type: String, enum: ["Single", "Married", "Divorced", "Widowed"], required: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
