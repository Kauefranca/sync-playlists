const readLine = require('readline-sync');
const youtube = require('./lib/youtube');
const spotify = require('./lib/spotify');
const { godlessRegex } = require('./lib/utils');
const { getUserConsent } = require('./lib/getUserConsent');

;(async() => {
    const token = await getUserConsent();
    var userInfo = await spotify.getUserInfo(token.access_token);
    if (!userInfo) return console.log('An error ocurred during the Authentication');

    var videoList = await youtube.getVideoList(readLine.question('Insert the Youtube playlist URL: '));
    var playlistId = await spotify.createPlaylist(token.access_token, userInfo.id, { name: readLine.question('Insert a name for the Spotify playlist: '), description: 'Playlist auto converted from Youtube using Kauefranca/sync-playlists' })
    if (playlistId.error) return console.log(playlistId.error);
    console.log('Converting playlist, please wait...');

    for (let i in videoList) {
        var title = videoList[i].title.replace(godlessRegex, ' ').replace(/([ ]{2,})/gi, ' ').trim();
        if (title) {
            var uri = await spotify.queryTrackUri(token.access_token, encodeURIComponent(title));
            if (!uri.error) {
                await spotify.addTrackOnPlaylist(token.access_token, playlistId.data, uri.data);
            } else console.log(decodeURIComponent(uri.error.message));
        }
    }
})();