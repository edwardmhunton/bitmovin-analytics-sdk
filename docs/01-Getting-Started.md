# Integrating the Analytics Collector


## Minimal Configuration

Setting up Bitmovin Analytics is very simple. A minimal configuration can be set up in 5 lines of code.

```js
var  bitanalyticsConfig  =  { key: "<analytics-key>"};var analytics = bitmovin.analytics(bitanalyticsConfig);

var player = bitmovin.player("player");
var playerConfig = {}; // Set up your Bitmovin Player Configuration

// Instrument the Player with Analytics
analytics.register(analytics);
player.setup(playerConfig);
```

It is important to call `analytics.register` before `player.setup`!

## Optional Fields and Important Fields

While the minimum configuration is the bare minimum to get started, the following fields are strongly recommended to be set:

* videoId
* cdnProvider

### VideoID

Supplying a videoId to Analytics makes it easy to distinguish between played contents so it is highly recommended to set this setting to something that corresponds with your System (usually a CMS Id or some string that identifies the Video for you)

Setting the videoId is simple. 

```js
var bitanalyticsConfig = {
  key: "<analytics-key>",
  videoId: "<your video id>"
}
```

### CDN Provider

If you are using multiple CDNs or plan to test with different CDNs in the future it's very helpful to set the cdnProvider parameter to be able to compare performance between the CDNs. You can specify any string, but we have built in some constants that are available on `bitmovin.analytics.CdnProviders.`

* BITMOVIN
* AKAMAI
* FASTLY
* MAXCDN
* CLOUDFRONT
* CHINACACHE
* BITGRAVITY

### Custom Data

It is possible to supply custom data to Bitmovin Analytics.
We support 5 fields for custom data as well as `experimentName` which can be used to [A/B Test your setup](https://github.com/bitmovin/bitmovin-analytics-sdk/blob/master/ab-testing.md)

CustomData fields include:

* customData1
* customData2
* customData3
* customData4
* customData5

## Verifying your Setup

To test if your setup is working you can just go to the [Analytics Dashboard](https://analytics-dashboard.bitmovin.com/) to see if your sessions are being recorded.