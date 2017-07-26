# A/B Testing with Bitmovin Analytics

Bitmovin Analytics offers the ability to do A/B testing out of the box on any data field you want.
Since out API allows you to filter or group on any field we tracked you can often do A/B testing even on data you did not explicitly set up for A/B testing.

For example, let's say you have deployed a new Version of the Player. Analytics will automatically pick up the new Player version and save it.
So to compare the old with the new Player you just need to query a Metric and `GroupBy` on the `PLAYER_VERSION` field.

Comparing startuptime between Players using the [Bitmovin Javascript/NodeJs API-Client](https://github.com/bitmovin/bitmovin-javascript)  is as easy as:

```js
bitmovin.analytics.queries.builder.median('STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .groupBy('PLAYER_VERSION')
  .filter('STARTUPTIME', 'GT', 0)
  .query()
```

But sometimes there are changes that can't be picked up automatically, so we have added the fields `experimentName` and `customData` to indicate changes which you can set yourself through the Analytics Configuration.

Let's say we do a comparison of our custom ABR Logic with 3 variants we could add the following:

```js
var analyticsConfig = {
  key: "<YOUR KEY>",
  experimentName: 'ABR-Tests',
  customData1: 'abr-variant-1'
}
```

Obviously the `customData1` would vary depending on what variant of the new custom ABR-Logic gets tested by the customer. Some logic on the server is required to decide which users get what variant of the new ABR-Logic, but once that is sorted out you can simply compare video startuptimes with the following query:

```js
bitmovin.analytics.queries.builder.median('VIDEO_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .groupBy('customData1')
  .filter('EXPERIMENT_NAME', 'EQ', 'ABR-Tests')
  .filter('VIDEO_STARTUPTIME', 'GT', 0)
  .query()
```

The same goes for `CDN_PROVIDER` which you just have to put into the analytics configuration (the field is called `cdnProvider` - see our [simple example](https://github.com/bitmovin/bitmovin-analytics-sdk/blob/master/simple.html)) and can then be used in conjunction with all the other data to compare CDN performance.

For example if we are interested in the best performing CDN in the US in terms of video startuptime we can do:

```js
bitmovin.analytics.queries.builder.median('VIDEO_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .groupBy('CDN_PROVIDER')
  .filter('CDN_PROVIDER', 'EQ', 'us')
  .filter('VIDEO_STARTUPTIME', 'GT', 0)
  .query()
```

We can even `groupBy` multiple variables to for example get a comparison of how the CDN fares either for DASH or HLS:

```js
bitmovin.analytics.queries.builder.median('VIDEO_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .groupBy('CDN_PROVIDER')
  .groupBy('STREAM_FORMAT')
  .filter('CDN_PROVIDER', 'EQ', 'us')
  .filter('VIDEO_STARTUPTIME', 'GT', 0)
  .query()
```