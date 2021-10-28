const axios = require('axios');
const fs = require('fs');

const youtubeApiUrl = 'https://www.youtube.com/youtubei/v1/';
const playlistUrl = 'https://www.youtube.com/playlist?list=PLPRsRurBd7FRrRwpp4tEYMUlYY2kOzMg5';

;(async() => {
    var allTitles;
    var request = await axios({
        method: 'get',
        url: playlistUrl,
        headers: {
            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36,gzip(gfe)',
        }
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
    var titles = videoList.map(function (obj) {
        if (!obj.playlistVideoRenderer) return;
        return obj.playlistVideoRenderer.title.runs[0].text;
    });

    console.log(titles);
})();

function removeUnicode(str) {
    var r = /\\u([\d\w]{4})/gi;
    str = str.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
    return decodeURIComponent(str);
}