# FAQ

This is a list of frequently asked questions about bitmovin analytics and its collected metrics.

## Startup Time Metrics

Bitmovin Analytics collects startuptimes in 4 different flavours:

### `STARTUPTIME` - End-to-end delay of a playback session

The metric `STARTUPTIME` will return the total of `PLAYER_STARTUPTIME` + `VIDEO_STARTUPTIME`.

### `PLAYER_STARTUPTIME` - Duration of player setup

How long did it take the player to load. Essentially the duration it took until the user could start playback.

This is measured as the time elapsed between `analytics.register(player)` is called and the player emitting the `ON_READY` event.

### `VIDEO_STARTUPTIME` - Time to stream start

From the time the user expressed intent to watch the video until the first frame was displayed on his screen.

This is measured as the time between `ON_PLAY` to the first `ON_TIME_CHANGED` event being fired.

### `PAGE_LOAD_TIME` - Time it took the page to load

Not directly related to video - `PAGE_LOAD_TIME` is the total amount of time it took for the player to report ready, counted from the `navigationStart`. This metric is useful if you want to measure if improvements on the surrounding page positively or negatively impacted the total load time of the page until the user is _theoretically_ able to start video playback.

### `PAGE_LOAD_TYPE` - Was the page loaded in the foreground or background?

When a user opens a link in a new tab, certain browsers like Chrome will not allocate as many resources to the loading as to foreground tabs. This means that timers become unreliable and certain elements of a page (like the [Media Source Extensions](https://en.wikipedia.org/wiki/Media_Source_Extensions)) are not loaded until the user brings the tab into the foreground.

This impacts analytics as the `ON_READY` event will only be fired once the page comes back into the foreground.
This obviously skews any startup performance data collected as users that keep the background tab open for a few days will have a `PLAYER_STARTUPTIME` of days, not milliseconds. 

To address this, bitmovin analytics has a field which can be filtered for called `PAGE_LOAD_TYPE`.

* 1: Foreground
* 2: Background
