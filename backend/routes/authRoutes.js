const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Example User model
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: String,
});
const User = mongoose.model("User", UserSchema);

// POST /api/auth/register
router.post("/register", async(req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role });
        const token = jwt.sign({ id: user._id }, "secretkey"); // Use env in production

        res.json({ msg: "Registered successfully", token, user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// POST /api/auth/login
router.post("/login", async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

        const token = jwt.sign({ id: user._id }, "secretkey");
        res.json({ msg: "Login successful", token, user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;