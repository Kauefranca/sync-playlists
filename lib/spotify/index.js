const axios = require('axios');
const API_URL = 'https://api.spotify.com/v1/';

/**
 * Search for a track on spotify
 *
 * @param {String} token Spotify access token
 * @param {String} query Search query
 * @returns {promise<Object>} returns data find a musica and error if not
 */
exports.queryTrackUri = async (token, query) => {
    var data = await axios({
        method: 'get',
        url: `${API_URL}search?q=${query}&type=track&limit=1`,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);

    if (data.error) return data

    if (data.tracks.items.length == 0) return { error: { message: 'No tracks founded for query ' + query } }

    return { data: data.tracks.items[0].uri }
}

/**
 * Add a track in a Spotify playlist
 *
 * @param {String} token Spotify access token
 * @param {String} playlistId Spotify playlist ID
 * @param {Array} trackURI Spotify track URI
 * @returns {promise<Boolean>} returns true if succed and false if not
 */
exports.addTrackOnPlaylist = async (token, playlistId, trackURI) => {
    var data = {
        "position": 0,
        "uris": trackURI.constructor === Array ? trackURI : [trackURI],
    }

    var req = await axios({
        method: 'post',
        url: `${API_URL}playlists/${playlistId}/tracks`,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);

    if (req.error) return false;
    return true;
}

/**
 * Create a Spotify playlist
 *
 * @param {String} token Spotify access token
 * @param {Object} playlistData Spotify playlist data
 * @param {Array} userId Spotify user ID
 * @returns {promise<String>} if succed returns playlist ID, a error if not
 */
exports.createPlaylist = async (token, userId, playlistData) => {
    if (!playlistData.name || !playlistData.description) return { error: { message: 'Playlist name and description are required on playlistData!' } }
    if (!playlistData.public) playlistData.public == false;

    var req = await axios({
        method: 'post',
        url: `${API_URL}users/${userId}/playlists`,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: JSON.stringify(playlistData)
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);

    if (req.error) return req;
    return { data: req.id };
}

/**
 * Get info from user using the token
 *
 * @param {String} token Spotify access token
 * @returns {promise<Object>} User info or undefinde if token is invalid
 */
exports.getUserInfo = async (token) => {
    var req = await axios({
        method: 'get',
        url: `${API_URL}me`,
        headers: {
            'Authorization': 'Bearer ' + token
        },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);

    if (req.error) return '';
    return req;
}