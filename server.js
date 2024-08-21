const express = require('express');
const axios = require('axios');
const path = require('path');
const config = require('./config/config');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})); 

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

app.get('/auth/zoom', (req, res) => {
    const zoomOAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}`;
    res.redirect(zoomOAuthUrl);
});

app.get('/oauth/callback', async (req, res) => {
    const { code } = req.query;
    
    if (!code) {
        return res.status(400).send('Missing authorization code.');
    }

    try {
        console.log('Calling Zoom API: Token Exchange');
        console.log('Payload sent:', JSON.stringify({ code, redirect_uri: config.REDIRECT_URI }, getCircularReplacer(), 2));
        const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                redirect_uri: config.REDIRECT_URI
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64')}`,
            },
        });
        console.log('Zoom API Token Exchange successful');
        console.log('Response received:', JSON.stringify(tokenResponse.data, getCircularReplacer(), 2));

        const { access_token } = tokenResponse.data;
        req.session.access_token = access_token;
        res.redirect('/');
    } catch (error) {
        console.error('Zoom API Token Exchange failed:', JSON.stringify(error.response ? error.response.data : error.message, getCircularReplacer(), 2));
        res.status(500).send('Failed to exchange token.');
    }
});

app.get('/api/channels', async (req, res) => {
    const access_token = req.session.access_token;

    if (!access_token) {
        return res.status(401).send('No access token available. Please authenticate.');
    }

    try {
        console.log('Calling Zoom API: Fetch Channels');
        console.log('Headers sent:', JSON.stringify({ Authorization: `Bearer ${access_token}` }, getCircularReplacer(), 2));
        const channelsResponse = await axios.get('https://api.zoom.us/v2/chat/users/me/channels', {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        console.log('Zoom API Fetch Channels successful');
        console.log('Response received:', JSON.stringify(channelsResponse.data, getCircularReplacer(), 2));
        
        res.json(channelsResponse.data.channels);
    } catch (error) {
        console.error('Zoom API Fetch Channels failed:', JSON.stringify(error.response ? error.response.data : error.message, getCircularReplacer(), 2));
        res.status(500).send('Failed to fetch channels.');
    }
});

app.post('/api/send-message', async (req, res) => {
    const access_token = req.session.access_token;
    const { channelId, messageText } = req.body;

    if (!access_token) {
        return res.status(401).send('No access token available. Please authenticate.');
    }

    try {
        console.log('Calling Zoom API: Send Message');
        const payload = {
        to_channel: channelId,
        message: messageText,
            interactive_cards: [
              {
                card_json: JSON.stringify({
                  content: {
                    body: [
                      {
                        type: "message",
                        text:  "Check out this update on Jam."
                      },
                      {
                        type: "attachments",
                        resource_url: "https://i0.wp.com/www.pardonyourfrench.com/wp-content/uploads/2022/05/strawberry-jam-5.jpg?fit=1170%2C1753&ssl=1",
                        img_url: "https://i0.wp.com/www.pardonyourfrench.com/wp-content/uploads/2022/05/strawberry-jam-5.jpg?fit=1170%2C1753&ssl=1",
                        information: {
                          title: {
                            text: "Jam Update"
                          },
                          description: {
                            text: "This image shows the latest update on Jam."
                          }
                        }
                      },
                      {
                        type: "message",
                        text: "View on Jam",
                        link: "https://jam.dev"
                      }
                      
                    ]
                    
                  }
                })
              }
            ]
          };
          
        console.log('Payload sent:', JSON.stringify(payload, getCircularReplacer(), 2));
        const response = await axios.post('https://api.zoom.us/v2/chat/users/me/messages', payload, {
            headers: { 
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Zoom API Send Message successful');
        console.log('Response received:', JSON.stringify(response.data, getCircularReplacer(), 2));

        res.status(200).send('Message sent successfully.');
    } catch (error) {
        console.error('Zoom API Send Message failed:', JSON.stringify(error.response ? error.response.data : error.message, getCircularReplacer(), 2));
        res.status(500).send('Failed to send message.');
    }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
