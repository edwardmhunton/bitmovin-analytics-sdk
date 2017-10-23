# Startuptime Graph Example

This example shows you how to easily query the Bitmovin Analytics API for the p50, p90 and p95 percentiles of Startuptimes.

(Note: Startuptime = Time from player.setup() to the first `onTimeChanged` event being fired)

The relevant query is:

```
let query = bitmovin.analytics.queries.builder.percentile('STARTUPTIME', percentile)
  .between(from, to)
  .interval('DAY')
  .filter('STARTUPTIME', 'GT', 0)
  .orderBy('DAY', 'DESC')
   // Important - check that we are only looking at foreground loaded impressions
  .filter('PAGE_LOAD_TYPE', 'EQ', 1)
  .query();
};
```

# How to run

To run this example just start `index.html` on a local webserver (for example [caddy](https://caddyserver.com/)).

# Development

If you want to play around with the example (eg. modify the query) use yarn to build the `bundle.js`:

```
$ yarn install
$ yarn run debug
```

Yarn run debug will watch main.js for changes and re-build `bundle.js` automatically on demand.