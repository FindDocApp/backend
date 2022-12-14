const express = require('express');
const router = express.Router();
// Controllers
const contactForm = require('../controllers/home/contactForm');

// Api endpoints
// POST
router.post('/contact-form', contactForm);

module.exports = router;