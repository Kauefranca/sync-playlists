const youtube = require('./lib/youtube');
const spotify = require('./lib/spotify');
const { godlessRegex } = require('./lib/utils');

const token = '';

;(async() => {
    var userInfo = await spotify.getUserInfo(token)
    if (!userInfo) return console.log('Invalid access token!');

    var videoList = await youtube.getVideoList('https://www.youtube.com/playlist?list=PLPRsRurBd7FRrRwpp4tEYMUlYY2kOzMg5');
    var playlistId = await spotify.createPlaylist(token, userInfo.display_name, { name: 'playlist-sync', description: 'Playlist converted from Youtube' })
    if (playlistId.error) return console.log('An error occurred creating the playlist.');

    for (let i in videoList) {
        var title = videoList[i].title.replace(godlessRegex, ' ').replace(/([ ]{2,})/gi, ' ').trim();
        if (title) {
            var uri = await spotify.queryTrackUri(token, encodeURIComponent(title));
            if (!uri.error) {
                await spotify.addTrackOnPlaylist(token, playlistId.data, uri.data);
            }
        }
    }
})();