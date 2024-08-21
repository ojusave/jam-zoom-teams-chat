// config/config.js
require('dotenv').config();

module.exports = {
    CLIENT_ID: process.env.ZOOM_CLIENT_ID,
    CLIENT_SECRET: process.env.ZOOM_CLIENT_SECRET,
    REDIRECT_URI: process.env.ZOOM_REDIRECT_URI
};
