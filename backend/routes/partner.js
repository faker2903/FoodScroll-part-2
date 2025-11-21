const express = require('express');
const { updateProfile, addZomatoLink } = require('../controllers/partnerController');
const { auth, verifyRole } = require('../middleware/auth');

const router = express.Router();

router.put('/update-profile', auth, verifyRole(['partner']), updateProfile);
router.put('/add-zomato-link/:videoId', auth, verifyRole(['partner']), addZomatoLink);

module.exports = router;
