const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const { registerUser, loginUser, updateUserPassword, forgotPassword, resetPassword } = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update/:id', updateUserPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
module.exports = router;