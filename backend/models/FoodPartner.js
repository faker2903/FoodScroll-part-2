const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'partner',
        enum: ['partner'],
    },
    shopName: {
        type: String,
        required: true,
    },
    shopAddress: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    uploadedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
}, { timestamps: true });

module.exports = mongoose.model('FoodPartner', foodPartnerSchema);
