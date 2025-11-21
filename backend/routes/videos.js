const express = require('express');
const multer = require('multer');
const {
    uploadVideo,
    getAllVideos,
    getPartnerVideos,
    likeVideo,
    addComment,
    deleteComment,
    getComments,
    saveVideo,
    getSavedVideos,
    getImageKitAuth
} = require('../controllers/videoController');
const { auth, verifyRole } = require('../middleware/auth');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', auth, verifyRole(['partner']), upload.single('video'), uploadVideo);
router.get('/all', auth, verifyRole(['user']), getAllVideos);
router.get('/by-partner/:id', getPartnerVideos);
router.put('/like/:id', auth, verifyRole(['user']), likeVideo);
router.post('/comment/:id', auth, verifyRole(['user']), addComment);
router.delete('/comment/:id', auth, verifyRole(['user']), deleteComment);
router.get('/comments/:id', getComments);
router.post('/save/:id', auth, verifyRole(['user']), saveVideo);
router.get('/saved', auth, verifyRole(['user']), getSavedVideos);
router.get('/imagekit-auth', getImageKitAuth);

module.exports = router;
