const axios = require('axios');
const { removeUnicode } = require('../utils');

const youtubeApiUrl = 'https://www.youtube.com/youtubei/v1/';
const watchUrl = 'https://www.youtube.com/watch?v=';

const headers = {
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36,gzip(gfe)',
    'accept-language': 'en-US,en;q=0.5'
}

/**
 * Get all videos title and id from a playlist
 *
 * @param {String} playlistUrl The Youtube playlist url
 * @returns {Promise<Array>} List of videos  
 */
exports.getVideoList = async (playlistUrl)  => {
    var request = await axios({
        method: 'get',
        url: playlistUrl,
        headers
    })
    .then((res) => res.data)
    .catch((err) => err);

    var playlist = JSON.parse(request.split('ytInitialData =')[1].split(';')[0]);
    var videoList = playlist.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;

    if (videoList.length == 101) {
        var browseApiKey = request.split('INNERTUBE_API_KEY":"')[1].split('"')[0];
        var cfg = removeUnicode('{"CLIENT_CANARY_STATE' + request.split('CLIENT_CANARY_STATE')[1].split(');')[0]);
        cfg = JSON.parse(cfg);

        var continuation = videoList.pop()
        var continuationToken = continuation.continuationItemRenderer.continuationEndpoint.continuationCommand.token;

        var data = {
            context: {
                client: cfg.INNERTUBE_CONTEXT.client,
                user: cfg.INNERTUBE_CONTEXT.user,
                request: cfg.INNERTUBE_CONTEXT.request,
                clickTracking: cfg.INNERTUBE_CONTEXT.clickTracking
            },
            continuation: continuationToken
        }

        var loadVideos = await axios({
            method: 'post',
            url: `${youtubeApiUrl}browse?key=${browseApiKey}`,
            data
        })
        .then((res) => res.data)
        .catch((err) => err);

        for (let i of (loadVideos.onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems)) {
            videoList.push(i);
        }
    }

    return videoList.map(function (obj) {
        if (!obj.playlistVideoRenderer) return;
        return { title: obj.playlistVideoRenderer.title.runs[0].text, videoId: obj.playlistVideoRenderer.videoId };
    });
}

/**
 * Checks if a Youtube video is a music
 *
 * @param {String} videoId Youtube videoId
 * @returns {Promise<Boolean>} True if is a music false if it's not
 */
exports.isMusic = async (videoId)  => {
    var request = await axios({
        method: 'get',
        url: watchUrl + videoId,
        headers
    })
    .then((res) => res.data)
    .catch((err) => err);

    var info = JSON.parse(request.split('ytInitialPlayerResponse =')[1].split(';var')[0]);

    return info.microformat.playerMicroformatRenderer.category == 'Music';
}