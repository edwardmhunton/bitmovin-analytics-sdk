const moment = require('moment');
const Bitmovin = require('bitmovin-javascript').default;
const bitmovin = new Bitmovin({ 'apiKey': '<YOUR API KEY>' });

// Query the Number of Impressions that saw an error in the last hour

const query = bitmovin.analytics.queries.builder.count('IMPRESSION_ID')
  .between(moment().startOf('hour').toDate(), moment().toDate())
  .interval('DAY')
  .groupBy('ERROR_CODE')
  .query() // this returns a JavaScript Promise

query.then((results) => {
  // results.rows contains the result set
  // result.columnLabels contains a description of what the array rows represent
  console.log(results.rows.map(mapFirstRowToReadableDateTimeFormat));
});

const mapFirstRowToReadableDateTimeFormat = (row) => {
  row[0] = moment(row[0]).format();
  return row;
}
