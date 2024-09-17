// controllers/zoomAuth.js
const axios = require('axios');
const config = require('../config/config');

// Optional: Uncomment if you have a circular JSON replacer utility
// const getCircularReplacer = require('../utils/getCircularReplacer');

/**
 * Redirects the user to Zoom's OAuth authorization page.
 */
exports.zoomAuth = (req, res) => {
    const zoomOAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.CLIENT_ID}&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}`;
    res.redirect(zoomOAuthUrl);
};

/**
 * Handles the OAuth callback from Zoom and exchanges the authorization code for tokens.
 */
exports.zoomCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Missing authorization code.');
    }

    try {
        console.log('Calling Zoom API: Token Exchange');
        const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: config.REDIRECT_URI
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        console.log('Zoom API Token Exchange successful', tokenResponse.data);

        // Store tokens and expiration time in session
        req.session.access_token = tokenResponse.data.access_token;
        req.session.refresh_token = tokenResponse.data.refresh_token;
        req.session.token_expires_at = Date.now() + (tokenResponse.data.expires_in * 1000); // Current time + expires_in in ms

        res.redirect('/'); // Redirect to home or desired route
    } catch (error) {
        console.error('Zoom API Token Exchange failed:', JSON.stringify(error.response ? error.response.data : error.message, null, 2));
        res.status(500).send('Failed to exchange token.');
    }
};

/**
 * Handles user logout by revoking the access token and clearing the session.
 */
exports.logout = async (req, res) => {
    const accessToken = req.session.access_token;

    if (!accessToken) {
        return res.redirect('/');
    }

    try {
        await axios.post('https://zoom.us/oauth/revoke', null, {
            params: {
                token: accessToken
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        console.log('Access token revoked successfully.');
    } catch (error) {
        console.error('Failed to revoke access token:', error.response ? error.response.data : error.message);
        // Proceed to clear session even if revocation fails
    }

    // Clear session data
    req.session.destroy(err => {
        if (err) {
            console.error('Failed to destroy session during logout:', err);
        }
        res.redirect('/');
    });
};
