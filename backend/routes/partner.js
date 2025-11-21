const express = require('express');
const FoodPartner = require('../models/FoodPartner');
const { auth, verifyRole } = require('../middleware/auth');

const router = express.Router();

// Update Profile
router.put('/update-profile', auth, verifyRole(['partner']), async (req, res) => {
    try {
        const { shopName, shopAddress, profilePic } = req.body;
        const updatedPartner = await FoodPartner.findByIdAndUpdate(
            req.user.id,
            { shopName, shopAddress, profilePic },
            { new: true }
        ).select('-password');

        res.json(updatedPartner);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add Zomato Link (Can also be done via update-profile or per video, but per requirements: "FoodPartners can add a Zomato link per video")
// The requirement says "FoodPartners can add a Zomato link per video".
// It also says "FoodPartner Routes: /partner/add-zomato-link".
// This might be for a general shop link or updating a specific video.
// Let's assume it's for updating a specific video if the ID is provided, or maybe just a placeholder.
// Actually, the video upload route already handles Zomato link.
// Let's make this route update a specific video's Zomato link.

router.put('/add-zomato-link/:videoId', auth, verifyRole(['partner']), async (req, res) => {
    try {
        const { zomatoLink } = req.body;
        const video = await Video.findOne({ _id: req.params.videoId, partnerId: req.user.id });

        if (!video) {
            return res.status(404).json({ message: 'Video not found or unauthorized' });
        }

        video.zomatoLink = zomatoLink;
        await video.save();

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
