const https = require('https');
const request = require('request');
const errors = require('./src/errors.js')

const { ANALYTICS_KEY, PLAYER_KEY } = process.env;

const videoIds = [
  'funny-catvideos',
  '24-hours-news',
  'your-fav-station',
  'steam-stream',
]

generateTestData = () => {
  const { errorCode, errorMessage } = errors[Math.floor(Math.random() * errors.length)];
  const videoId = videoIds[Math.floor(Math.random() * videoIds.length)];
  const impressionId = `${Math.floor(Math.random() * 5000)}`;
  const userId = `${Math.floor(Math.random() * 2000)}`;

  return JSON.stringify({
    ad: 0,
    analyticsVersion: "v1.5.2",
    audioBitrate: 0,
    buffered: 0,
    cdnProvider: "akamai",
    domain: "bitmovin-analytics-collector.dev",
    droppedFrames: 0,
    duration: 0,
    errorCode,
    errorMessage,
    experimentName: "bitmovinanalytics-local",
    impressionId,
    isCasting: false,
    isLive: true,
    isMuted: false,
    key: ANALYTICS_KEY,
    language: "de",
    m3u8Url: "https://bitcdn-kronehit.bitmovin.com/v2/hls/playlist.m3u8",
    pageLoadTime: 0,
    pageLoadType: 1,
    path: "/bitmovin.html",
    paused: 0,
    played: 0,
    player: "bitmovin",
    playerKey: PLAYER_KEY,
    playerStartupTime: 0,
    playerTech: "html5",
    screenHeight: 1050,
    screenWidth: 1680,
    seeked: 0,
    size: "WINDOW",
    startupTime: 0,
    state: "error",
    streamFormat: "hls",
    time: new Date().getTime(),
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
    userId,
    version: "bitmovin-7.4.7",
    videoBitrate: 0,
    videoDuration: null,
    videoId,
    videoPlaybackHeight: 0,
    videoPlaybackWidth: 0,
    videoStartupTime: 0,
    videoTimeEnd: 0,
    videoTimeStart: 0,
    videoWindowHeight: 225,
    videoWindowWidth: 400
  });
}

const postTestData = () => {
  const postData = generateTestData();
  request({
      url: 'https://analytics-ingress-global.bitmovin.com/analytics',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Origin': 'http://bitmovin-analytics-collector.dev',
      },
      body: postData,
    },
    (error, response) => console.log(response.statusCode, response.statusMessage)
  );

  const nextPostIn = Math.ceil(Math.random() * 2000);
  setTimeout(postTestData, nextPostIn);
}

postTestData();
