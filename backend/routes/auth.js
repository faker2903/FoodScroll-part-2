const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FoodPartner = require('../models/FoodPartner');

const router = express.Router();

// Register User
router.post('/register-user', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Register Partner
router.post('/register-partner', async (req, res) => {
    try {
        const { name, email, password, shopName, shopAddress, profilePic } = req.body;
        const existingPartner = await FoodPartner.findOne({ email });
        if (existingPartner) return res.status(400).json({ message: 'Partner already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPartner = new FoodPartner({
            name,
            email,
            password: hashedPassword,
            shopName,
            shopAddress,
            profilePic
        });
        await newPartner.save();

        res.status(201).json({ message: 'Partner registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let user;
        if (role === 'user') {
            user = await User.findOne({ email });
        } else if (role === 'partner') {
            user = await FoodPartner.findOne({ email });
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                email: user.email,
                profilePic: user.profilePic,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
