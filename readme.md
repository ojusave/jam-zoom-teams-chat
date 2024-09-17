# Zoom Chat Integration

## Overview

This project integrates Zoom Chat functionality into your application, allowing you to authenticate users, fetch Zoom channels, and send messages to these channels. It leverages the Zoom API and OAuth 2.0 for secure authentication and interaction.

## Features

- OAuth 2.0 authentication with Zoom
- Fetch user's Zoom channels
- Send messages to Zoom channels with links

## Prerequisites

- Node.js (v12 or higher recommended)
- npm (comes with Node.js)
- A Zoom account
- A registered Zoom OAuth app (instructions below)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ojusave/zoom-chat-integration.git
   cd zoom-chat-integration
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```plaintext
   ZOOM_CLIENT_ID=your_client_id
   ZOOM_CLIENT_SECRET=your_client_secret
   ZOOM_REDIRECT_URI=http://localhost:4000/oauth/callback
   PORT=4000
   ```
   Replace `your_client_id` and `your_client_secret` with your Zoom OAuth app credentials.

4. Start the server:
   ```bash
   node server.js
   ```

## Creating a Zoom OAuth App

1. Go to the [Zoom App Marketplace](https://marketplace.zoom.us/) and sign in.
2. Click "Develop" > "Build App".
3. Choose "OAuth" as the app type.
4. Fill in the app information:
   - App Name: Your choice (e.g., "My Zoom Chat Integration")
   - App Type: User-managed app
   - Redirect URL: `http://yourdomain.com/oauth/callback` (adjust if using a different port)
5. Add the following scopes:
   - `chat_channel:read`
   - `chat_channel:write`
   - `chat_message:read`
   - `chat_message:write`
6. Save and note down your Client ID and Client Secret.

## Usage

1. Navigate to `http://localhost:4000` in your browser.
2. Click "Authenticate with Zoom" to start the OAuth flow.
3. After successful authentication, you'll be redirected to the home page.
4. Use the interface to select a channel and send a message.

## API Endpoints

- `GET /auth/zoom`: Initiates the Zoom OAuth flow
- `GET /oauth/callback`: Handles the OAuth callback from Zoom
- `GET /api/channels`: Fetches the user's Zoom channels
- `POST /api/send-message`: Sends a message to a Zoom channel

## File Structure

```
.
├── config/
│   └── config.js
├── controllers/
│   ├── zoomAuth.js
│   ├── zoomChannels.js
│   └── zoomMessages.js
├── utils/
│   └── tokenManager.js
├── .env
├── package.json
├── README.md
└── server.js
```
## Acknowledgements

- [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference/introduction)
- [Express.js](https://expressjs.com/)
- [Axios](https://axios-http.com/)