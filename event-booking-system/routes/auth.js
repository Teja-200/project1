// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Handle Registration
router.post('/register', async(req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });
    res.redirect('/login');
});

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Handle Login
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user._id;
        res.redirect('/');
    } else {
        res.send('Invalid credentials');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;