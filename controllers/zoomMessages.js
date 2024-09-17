// controllers/zoomMessages.js
const axios = require('axios');
//const getCircularReplacer = require('../utils/getCircularReplacer');

// Sends a message to the Zoom channel
exports.sendMessage = async (req, res) => {
    const access_token = req.session.access_token;
    const { channelId, messageText, linkUrl } = req.body;

    if (!access_token) {
        return res.status(401).send('No access token available. Please authenticate.');
    }

    try {
        // Construct the message with the optional link
        let fullMessage = messageText;
        if (linkUrl) {
            fullMessage += `\nView more here: ${linkUrl}`;
        }

        // Payload structure for sending the message
        const payload = {
            to_channel: channelId,
            message: fullMessage,
        };

        const response = await axios.post('https://api.zoom.us/v2/chat/users/me/messages', payload, {
            headers: { 
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Message sent successfully.');
    } catch (error) {
        console.error('Zoom API Send Message failed:', JSON.stringify(error.response ? error.response.data : error.message, getCircularReplacer(), 2));
        res.status(500).send('Failed to send message.');
    }
};
