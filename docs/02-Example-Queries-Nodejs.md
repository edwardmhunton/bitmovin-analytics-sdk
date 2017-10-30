# Query Examples - nodejs

All these examples assume you have set up the [bitmovin-js API Client](https://github.com/bitmovin/bitmovin-javascript) with your API Key and have moment.js installed to facilitate date calculations.

Initializing the API client is simple:

```js
const moment = require('moment');
const Bitmovin = require('bitmovin-javascript').default;
const bitmovin = new Bitmovin({ 'apiKey': '<YOUR API KEY>' });
```

The Analytics Query Builder returns a JavaScript Promise that contains the result. Eg:

```js
query.then((result) => { console.log(result); });
```

## Retrieving Unique Users
Number of unique users that played video on the site.

```js
const query = bitmovin.analytics.queries.builder.count('USER_ID')
  .between(moment().subtract(1, 'day').toDate(), moment().toDate())
  .interval('HOUR')
  .query() // this returns a JavaScript Promise
```

## Retrieving Total Impressions

Number of Unique Play sessions.

```js
const query = bitmovin.analytics.queries.builder.count('IMPRESSION_ID')
  .between(moment().subtract(1, 'day').toDate(), moment().toDate())
  .interval('HOUR')
  .query() // this returns a JavaScript Promise
```

## Retrieving Average Viewing Time

How long on average did each user play videos (in milliseconds)

```js
const query = bitmovin.analytics.queries.builder.avg('VIEWTIME')
  .between(moment().subtract(10, 'day').toDate(), moment().toDate())
  .interval('DAY')
  .query() // this returns a JavaScript Promise
```

## Error Rate

The error rate is the Number of Errors that occured per Second of Video Playback. Only average queries are supported at the moment.

```js
const query = bitmovin.analytics.queries.builder.avg('ERROR_RATE')
  .between(moment().subtract(10, 'day').toDate(), moment().toDate())
  .interval('DAY')
  .query() // this returns a JavaScript Promise
```

## Startup Time

Startup time can be queries by average, but it's much more useful to query the median and relevant percentiles.

`STARTUPTIME` is the combination of `PLAYER_STARTUPTIME` + `VIDEO_STARTUPTIME`.

```js
const query = bitmovin.analytics.queries.builder.median('STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('STARTUPTIME', 'GT', 0)
  .filter('PAGE_LOAD_TYPE', 'EQ', 1) // Filters only players that didn't load in the background
  .query()
```

_**Note**: Chrome delays media loading when a tab is not loaded in the foreground. Analytics detects this and gives you the choice to filter only impressions where the page load was actively impacting the user experience._

`PLAYER_STARTUPTIME` is the time it took the player to load until it reported ready for playback:

```js
const playerStartupTime = bitmovin.analytics.queries.builder.median('PLAYER_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('PLAYER_STARTUPTIME', 'GT', 0)
  .filter('PAGE_LOAD_TYPE', 'EQ', 1) // Filters only players that didn't load in the background
  .query()
```

`VIDEO_STARTUPTIME` is the time it took the player to start playback of a stream. (From the time the user clicked play until the first frame was displayed)

```js
const videoStartupTime = bitmovin.analytics.queries.builder.median('VIDEO_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('VIDEO_STARTUPTIME', 'GT', 0)
  .query()
```

#### Note about Medians, Averages and Percentiles
Medians and Percentiles are less outlier-prone than a simple average and thus preferable to get a good understanding of how the startuptimes are distributed.

Simple Example: 100 users viewed your video and it took each user 1 millisecond to load the player.
The average would be 1 millisecond.
Now let's assume we have 99 users with 1 ms startup and one that took 100ms to start up. Doing the average results in `(99 + 100) / 100 = 1.99`. So although 99% of all our users saw a 1ms startup time - the average will mislead us and we'd think the performance was 100% worse than it actually was.

Percentiles and medians work by simply ordering all the values in ascending order and picking the value where exactly 50% (for the 50% percentile) are below this number. Example: 

```
Data: [.3, .8, 1.2, 2.8, 2.9, 3.4, 11, 23, 190]
                          ^            ^
50%/Median (middle of the list): 2.9
90% Percentile: 23
```

As you can see looking at the median, the 90th, 95th and maybe 99th percentile give us a much better overview of what is actually happening. If we take the average of the above data, we get 27! That's 10x worse than what 50% of your users were seeing and seriously misrepresents the actual distribution of data.
