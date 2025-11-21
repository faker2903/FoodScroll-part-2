const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    zomatoLink: {
        type: String,
        default: '',
    },
    partnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodPartner',
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    savesCount: {
        type: Number,
        default: 0,
    },
    commentsCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
