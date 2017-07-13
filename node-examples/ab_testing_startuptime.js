const moment = require('moment');
const Bitmovin = require('bitmovin-javascript').default;
const bitmovin = new Bitmovin({ 'apiKey': '<YOUR API KEY>' });

// Compare the Startuptimes between A/B Test Experiments you ran through the experimentName Config setting:

const query = bitmovin.analytics.queries.builder.median('STARTUPTIME')
  .between(moment().startOf('day').toDate(), moment().toDate())
  .interval('MONTH')
  .groupBy('EXPERIMENT_NAME')
  .filter('STARTUPTIME', 'GT', 0)
  .query() // this returns a JavaScript Promise

query.then((results) => {
  // results.rows contains the result set
  // result.columnLabels contains a description of what the array rows represent
  console.log("Startuptime median", results.rows);
});
