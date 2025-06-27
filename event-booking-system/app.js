const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://127.0.0.1/eventDB')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use(authRoutes);

// Protect event routes
app.use((req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
});
app.use('/', eventRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));