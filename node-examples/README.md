# Bitmovin Analytics Query Examples - JavaScript/Node

This folder shows you some examples on how to query metrics through the JavaScript API Client with the new Fluent Query Builder API.


# Installation

The examples requires the [bitmovin-javascript](https://github.com/bitmovin/bitmovin-javascript) API Client.

the `package.json` also contains [momentjs](https://momentjs.com/) to simplify Date calculations.

Clone this repository and run `npm install` in the node-examples folder.

Or copy the scripts and run:

```
$ npm install bitmovin-javascript
$ npm install moment
```

# Examples

There is one interactive example that you can just run directly from the commandline to retrieve StartupTime percentiles in the last week.

```
$ yarn install
$ yarn run startuptime
```

See [startuptime.js](https://github.com/bitmovin/bitmovin-analytics-sdk/blob/master/node-examples/startuptime.js)
