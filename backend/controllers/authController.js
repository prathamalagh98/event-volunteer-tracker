const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register
exports.register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "User already exists" });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const newUser = await User.create({ name, email, password: hashedPassword, role });

        // remove password before sending response
        const { password: _, ...userData } = newUser._doc;

        res.json({
            msg: "User registered successfully",
            user: userData,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// ✅ Login
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // check email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // generate token
        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        // remove password before sending response
        const { password: _, ...userData } = user._doc;

        res.json({
            msg: "Login successful",
            token,
            user: userData,
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};