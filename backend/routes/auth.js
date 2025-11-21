const express = require('express');
const { registerUser, registerPartner, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register-user', registerUser);
router.post('/register-partner', registerPartner);
router.post('/login', login);

module.exports = router;
