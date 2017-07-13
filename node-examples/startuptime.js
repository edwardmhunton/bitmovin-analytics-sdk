const moment = require('moment');
const Bitmovin = require('bitmovin-javascript').default;
const bitmovin = new Bitmovin({ 'apiKey': '<YOUR API KEY>' });

// Query the Median Startuptime of the Player
// Note: STARTUPTIME = PLAYER_STARTUPTIME + VIDEO_STARTUPTIME


const query = bitmovin.analytics.queries.builder.median('STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('STARTUPTIME', 'GT', 0)
  .query() // this returns a JavaScript Promise

query.then((results) => {
  // results.rows contains the result set
  // result.columnLabels contains a description of what the array rows represent
  console.log("Startuptime median", results.rows.map(mapFirstRowToReadableDateTimeFormat));
});

// Query the 90th Percentile of the Startuptime
const queryP90 = bitmovin.analytics.queries.builder.percentile('STARTUPTIME', 90)
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('STARTUPTIME', 'GT', 0)
  .query() // this returns a JavaScript Promise

queryP90.then((results) => {
  console.log("Startuptime p90", results.rows.map(mapFirstRowToReadableDateTimeFormat));
});

// Query the Median Player Startup Time
const playerStartupTime = bitmovin.analytics.queries.builder.median('PLAYER_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('PLAYER_STARTUPTIME', 'GT', 0)
  .query() // this returns a JavaScript Promise

playerStartupTime.then((results) => {
  console.log("Player Startuptime Median", results.rows.map(mapFirstRowToReadableDateTimeFormat));
});

// Query the Median Video Startuptime 
// (From the time the user clicked play to when the first frame was displayed)
const videoStartupTime = bitmovin.analytics.queries.builder.median('VIDEO_STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .filter('VIDEO_STARTUPTIME', 'GT', 0)
  .query() // this returns a JavaScript Promise

videoStartupTime.then((results) => {
  console.log("Video Startuptime Median", results.rows.map(mapFirstRowToReadableDateTimeFormat));
});

const mapFirstRowToReadableDateTimeFormat = (row) => {
  row[0] = moment(row[0]).format();
  return row;
}
