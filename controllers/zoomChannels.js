// controllers/zoomChannels.js
const axios = require('axios');
//const getCircularReplacer = require('../utils/getCircularReplacer');

// Fetches channels from the Zoom API
exports.getChannels = async (req, res) => {
    const access_token = req.session.access_token;

    if (!access_token) {
        return res.status(401).send('No access token available. Please authenticate.');
    }

    try {
        const channelsResponse = await axios.get('https://api.zoom.us/v2/chat/users/me/channels', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        res.json(channelsResponse.data.channels);
    } catch (error) {
        console.error('Zoom API Fetch Channels failed:', JSON.stringify(error.response ? error.response.data : error.message, getCircularReplacer(), 2));
        res.status(500).send('Failed to fetch channels.');
    }
};
