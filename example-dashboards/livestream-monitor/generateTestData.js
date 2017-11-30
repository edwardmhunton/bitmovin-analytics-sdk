const https = require('https');
const request = require('request');

const { ANALYTICS_KEY, PLAYER_KEY } = process.env;

const errors = [
  { errorCode: 1016, errorMessage: "<strong>License Error</strong></br> Could not find license." },
  { errorCode: 3000, errorMessage: "Unknown error" },
  { errorCode: 3001, errorMessage: "Unsupported manifest format" },
  { errorCode: 3002, errorMessage: "Segment contains no data" },
  { errorCode: 3003, errorMessage: "Corrupt tfdt version" },
  { errorCode: 3004, errorMessage: "No URL for segment found" },
  { errorCode: 3005, errorMessage: "No URL to manifest given" },
  { errorCode: 3006, errorMessage: "Could not load manifest, got HTTP status code " },
  { errorCode: 3011, errorMessage: "DRM: License request failed with HTTP status " },
  { errorCode: 3012, errorMessage: "DRM: Invalid header name/value pair for PlayReady license request" },
  { errorCode: 3013, errorMessage: "DRM: Key or KeyID is missing" },
  { errorCode: 3014, errorMessage: "DRM: Key size not supported" },
  { errorCode: 3016, errorMessage: "DRM: Unable to instantiate a key system supporting the required combinations" },
  { errorCode: 3017, errorMessage: "DRM: Unable to create or initialize key session" },
  { errorCode: 3018, errorMessage: "DRM: Failed to create and initialize a MediaKeys object" },
  { errorCode: 3019, errorMessage: "DRM: Key or KeyID is missing" },
  { errorCode: 3020, errorMessage: "DRM: Key Error" },
];

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

  const nextPostIn = Math.ceil(Math.random() * 200);
  setTimeout(postTestData, nextPostIn);
}

postTestData();
