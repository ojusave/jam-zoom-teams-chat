# Zoom Chat Integration

This project integrates Zoom Chat functionality into your application, allowing you to send messages and interact with Zoom channels.

## Getting Started

1. Clone this repository to your local machine.
3. Install npm: `npm install`
4. Create a `.env` file in the root directory with the following content:

```
ZOOM_CLIENT_ID=your_client_id 
ZOOM_CLIENT_SECRET=your_client_secret 
ZOOM_REDIRECT_URI=https://your-url/auth/callback
```

## Creating and Configuring a User-Managed OAuth App

Follow these steps to create and configure your user-managed OAuth app on the Zoom App Marketplace:

1. Log onto the [Zoom App Marketplace](https://marketplace.zoom.us/).

2. Click Develop > Build App.

3. On the Basic Info page:
   - Update your app's name.
   - In the "Select how the app is managed" section, choose "User-managed".
   - Note your app credentials (client ID & client secret).
   - In the OAuth Information section:
     - Enter your OAuth redirect URL (e.g., https://your-url.com/auth/callback).
     - Optionally enable Strict Mode URL and Subdomain check.
     - Add your app's URLs to the OAuth allow list.

4. On the Scopes page:
   - Click "Add Scopes".
   - Select the Zoom product and check the required scopes:
     - chat_channel:read
     - chat_channel:write
     - chat_message:read
     - chat_message:write
   - Provide a clear description for each selected scope.

5. On the Local Test page:
   - Add the app to your account by clicking "Add App Now" and then "Allow".
   - Preview your app listing by clicking "Preview Your App Listing Page".
   - To share with internal users, go to the Authorization URL section, click "Generate" and then "Copy".

Now you have successfully configured your Marketplace App and obtained the necessary credentials. You can use these to authenticate and interact with the Zoom Chat API in your application.

4. Start the server by running `node server.js`.

## Testing the Application

1. Open your browser and navigate to `http://localhost:3000`.
2. Click on the "Authenticate with Zoom" button to start the OAuth flow.
3. After successful authentication, you'll be redirected to the home page.
4. Use the provided interface to select a channel and send a message.