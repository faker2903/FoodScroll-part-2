const FoodPartner = require('../models/FoodPartner');
const Video = require('../models/Video');

exports.updateProfile = async (req, res) => {
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
};

exports.addZomatoLink = async (req, res) => {
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
};
