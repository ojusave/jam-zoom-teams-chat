// utils/tokenManager.js
const axios = require('axios');
const config = require('../config/config');

/**
 * Retrieves a valid access token.
 * Refreshes it if expired, or throws an error to initiate OAuth.
 * @param {Object} session - The session object.
 * @returns {String} - A valid access token.
 */
async function getValidAccessToken(session) {
    if (!session.access_token || !session.refresh_token) {
        throw new Error('No tokens available');
    }

    // Check if the access token has expired
    if (Date.now() >= session.token_expires_at) {
        console.log('Access token expired. Refreshing...');
        try {
            const refreshResponse = await axios.post('https://zoom.us/oauth/token', null, {
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: session.refresh_token
                },
                headers: {
                    Authorization: `Basic ${Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });

            console.log('Token refreshed successfully:', refreshResponse.data);

            // Update session with new tokens and expiration
            session.access_token = refreshResponse.data.access_token;
            session.refresh_token = refreshResponse.data.refresh_token;
            session.token_expires_at = Date.now() + (refreshResponse.data.expires_in * 1000); // current time + expires_in in ms

            return session.access_token;
        } catch (error) {
            console.error('Failed to refresh access token:', JSON.stringify(error.response ? error.response.data : error.message, null, 2));
            throw new Error('Failed to refresh access token');
        }
    }

    // Access token is still valid
    return session.access_token;
}

module.exports = {
    getValidAccessToken
};
