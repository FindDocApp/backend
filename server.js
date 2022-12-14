require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require("helmet");
const mongoose = require('mongoose');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(cors());

// Routes
app.use('/home', homeRoutes)
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Connecting to MongoDb database uri
mongoose.connect(process.env.MONGO_URI, (error) => {
    if (error) console.log(error)
    else console.log('. . . connected to database\n\n###\n')
});

// Setting up server to listen to connectied port 
app.listen(PORT, () => {
    console.log(`\n###\n\n. . . server listening on port ${PORT}`);
});