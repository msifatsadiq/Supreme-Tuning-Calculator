const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication endpoints
router.post('/login', authController.login);
router.post('/verify', authController.verifyToken);

module.exports = router;
