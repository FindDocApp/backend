const express = require('express');
const router = express.Router();
// Controllers
const signIn = require('../controllers/auth/signIn');
const register = require('../controllers/auth/register');
const passwordResetLink = require('../controllers/auth/passwordResetLink');
const resetPassword = require('../controllers/auth/resetPassword');

// Api endpoints
// POST
router.post('/sign-in', signIn);
router.post('/register', register);
router.post('/password-reset-link', passwordResetLink);
router.post('/reset-password', resetPassword);

module.exports = router;