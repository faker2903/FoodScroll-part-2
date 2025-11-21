const Video = require('../models/Video');
const User = require('../models/User');
const FoodPartner = require('../models/FoodPartner');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Save = require('../models/Save');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        const { title, description, zomatoLink } = req.body;

        // Upload to ImageKit
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer, // required
            fileName: `video-${Date.now()}-${req.file.originalname}`, // required
            folder: '/foodscroll_videos'
        });

        const newVideo = new Video({
            title,
            description,
            videoUrl: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url, // ImageKit might generate a thumbnail
            zomatoLink,
            partnerId: req.user.id
        });

        const savedVideo = await newVideo.save();

        // Add to partner's uploaded videos
        await FoodPartner.findByIdAndUpdate(req.user.id, {
            $push: { uploadedVideos: savedVideo._id }
        });

        res.status(201).json(savedVideo);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const userId = req.user.id;

        const videos = await Video.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('partnerId', 'name shopName profilePic')
            .lean();

        const videoIds = videos.map(v => v._id);

        const likes = await Like.find({ user: userId, video: { $in: videoIds } });
        const saves = await Save.find({ user: userId, video: { $in: videoIds } });

        const likedVideoIds = new Set(likes.map(l => l.video.toString()));
        const savedVideoIds = new Set(saves.map(s => s.video.toString()));

        const videosWithStatus = videos.map(video => ({
            ...video,
            isLiked: likedVideoIds.has(video._id.toString()),
            isSaved: savedVideoIds.has(video._id.toString())
        }));

        res.json(videosWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPartnerVideos = async (req, res) => {
    try {
        const videos = await Video.find({ partnerId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('partnerId', 'name shopName profilePic shopAddress');
        const partner = await FoodPartner.findById(req.params.id).select('-password');

        res.json({ partner, videos });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.likeVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const isAlreadyLiked = await Like.findOne({ user: userId, video: videoId });

        if (isAlreadyLiked) {
            await Like.deleteOne({ user: userId, video: videoId });
            await Video.findByIdAndUpdate(videoId, { $inc: { likeCount: -1 } });
            return res.json({ message: 'Video unliked', liked: false, likeCount: video.likeCount - 1 });
        }

        await Like.create({ user: userId, video: videoId });
        await Video.findByIdAndUpdate(videoId, { $inc: { likeCount: 1 } });
        res.json({ message: 'Video liked', liked: true, likeCount: video.likeCount + 1 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const newComment = new Comment({
            videoId: req.params.id,
            userId: req.user.id,
            text
        });
        await newComment.save();

        await Video.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });

        const populatedComment = await Comment.findById(newComment._id).populate('userId', 'name');
        res.json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await Comment.deleteOne({ _id: req.params.id });
        await Video.findByIdAndUpdate(comment.videoId, { $inc: { commentsCount: -1 } });

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ videoId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('userId', 'name');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.saveVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;

        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });

        const isAlreadySaved = await Save.findOne({ user: userId, video: videoId });

        if (isAlreadySaved) {
            await Save.deleteOne({ user: userId, video: videoId });
            await Video.findByIdAndUpdate(videoId, { $inc: { savesCount: -1 } });
            return res.json({ message: 'Video unsaved', saved: false });
        }

        await Save.create({ user: userId, video: videoId });
        await Video.findByIdAndUpdate(videoId, { $inc: { savesCount: 1 } });
        res.json({ message: 'Video saved', saved: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSavedVideos = async (req, res) => {
    try {
        const savedRecords = await Save.find({ user: req.user.id }).populate({
            path: 'video',
            populate: { path: 'partnerId', select: 'name shopName profilePic' }
        });
        const savedVideos = savedRecords.map(record => record.video);
        res.json(savedVideos);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getImageKitAuth = (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
};
