// get_token.js
const express = require('express');
const axios = require('axios');
const open = require('open');

const app = express();
const port = 8888;

// These credentials were provided by you.
const clientId = '8e1622beb2fd47dd992c815fb532d89c';
const clientSecret = 'DEIN_NEUES_CLIENT_SECRET';
const redirectUri = 'http://localhost:8888/callback';
const scope = 'user-read-currently-playing user-read-recently-played';

let server; // To close it later

// 1. Start server and automatically open the authorization link
function startAuthorization() {
    const authUrl = 'https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
        }).toString();

    console.log('\n\n✅ A temporary server has started. Your browser should open automatically.');
    console.log('   Please click the link below if it doesn\'t:');
    console.log(authUrl);
    console.log('\nWaiting for you to authorize the application in your browser...');
    open(authUrl);
}

// 2. Handle the callback from Spotify after authorization
app.get('/callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        const error = req.query.error || 'Unknown error';
        console.error(`\n❌ Error during authorization: ${error}`);
        res.send(`<h1>Authorization Failed</h1><p>Error: ${error}. Please check the terminal and try again.</p>`);
        if(server) server.close(() => process.exit(1));
        return;
    }
    
    res.send('<h1>Authorization successful!</h1><p>Processing token... Please check your terminal.</p>');

    try {
        // 3. Exchange the authorization code for tokens
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
            }
        });

        const { refresh_token } = response.data;

        console.log('\n\n✅ Success! You can now close the browser window.');
        console.log('--------------------------------------------------------------------------------');
        console.log('✅ YOUR REFRESH TOKEN (This is the final secret key, keep it safe):');
        console.log(refresh_token);
        console.log('--------------------------------------------------------------------------------');
        console.log('\nPlease copy this Refresh Token and paste it back to me.');
        console.log('You can now stop this script (Ctrl+C in the terminal).');

    } catch (error) {
        console.error('\n❌ Error exchanging code for token:', error.response ? error.response.data : error.message);
    } finally {
        if(server) server.close(() => process.exit(0));
    }
});

server = app.listen(port, () => {
    console.log(`--------------------------------------------------------------------------------`);
    console.log(`This script will help you get a Spotify Refresh Token.`);
    startAuthorization();
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${port} is already in use.`);
        console.error('   Please close the other application using this port and run the script again.');
    } else {
        console.error(`\n❌ Server error: ${err.message}`);
    }
    process.exit(1);
});
