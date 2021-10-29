const express = require('express');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config()

exports.getUserConsent = async () => {
    const webServer = await startWebServer();
    createAuthUrl();
    const authorizationToken = await waitForSpotifyCallback(webServer);
    const requestSpotifyAccessToken = await getSpotifyUserToken(authorizationToken);
    await stopWebServer(webServer);
    return requestSpotifyAccessToken;
}

async function startWebServer() {
    return new Promise((resolve, reject) => {
        const port = 8888;
        const app = express();
    
        const server = app.listen(port, () => {
            resolve({
                app,
                server
            })
        })
    })
}

function createAuthUrl() {
    var scope = 'user-read-private user-read-email user-library-read playlist-modify-public playlist-modify-private';
    return console.log('> Please give us your consent: ' + 'https://accounts.spotify.com/authorize?' +
        qs.stringify({
            response_type: 'code',
            client_id: process.env.client_id,
            scope: scope,
            redirect_uri: process.env.redirect_uri,
        }));
}

async function waitForSpotifyCallback(webServer) {
    return new Promise((resolve, reject) => {
        console.log('> Waiting for your consent...');

        webServer.app.get('/callback', (req, res) => {
            const authCode = req.query.code;
            res.send('<h1>Thanks for your consent!</h1><p>Now you can close this page!</p>');
            resolve(authCode);
        })
    })
}

async function getSpotifyUserToken(authorizationToken) {
    return await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (Buffer.from(process.env.client_id + ':' + process.env.client_secret).toString('base64'))
        },
        data: qs.stringify({
            code: authorizationToken,
            redirect_uri: process.env.redirect_uri,
            grant_type: 'authorization_code'
        })
    })
    .then((res) => res.data)
    .catch((err) => err.response);
}

async function stopWebServer(webServer) {
    return await webServer.server.close();
}