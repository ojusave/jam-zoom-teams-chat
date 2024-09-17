const express = require('express');
const session = require('express-session');
require('dotenv').config();
const path = require('path');
const zoomAuthController = require('./controllers/zoomAuth');
const zoomChannelsController = require('./controllers/zoomChannels');
const zoomMessagesController = require('./controllers/zoomMessages');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Zoom Authentication Routes
app.get('/auth/zoom', zoomAuthController.zoomAuth);
app.get('/oauth/callback', zoomAuthController.zoomCallback);

// Zoom Channels Route
app.get('/api/channels', zoomChannelsController.getChannels);

// Send Message Route
app.post('/api/send-message', zoomMessagesController.sendMessage);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
