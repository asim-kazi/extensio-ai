const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Tell dotenv to look one folder up from the current directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const projectRoutes = require('./routes/projects');
const subscriptionRoutes = require('./routes/subscription');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subscription', subscriptionRoutes);

module.exports = app;
