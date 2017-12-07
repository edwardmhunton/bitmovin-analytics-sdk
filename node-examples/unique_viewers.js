const moment = require('moment');
const Bitmovin = require('bitmovin-javascript').default;
const bitmovin = new Bitmovin({ 'apiKey': '<YOUR API KEY>' });
const from = moment('12 Nov 2017 12:00 PST').toDate()
const to = moment('14 Nov 2017 12:00 PST').toDate()

const query = bitmovin.analytics.queries.builder.count('USER_ID')
  .between(from, to)
  .query() // this returns a JavaScript Promise

query.then((results) => {
  // results.rows contains the result set
  console.log(results.rows);
}).catch(x => {
  // If something goes wrong this will output the response from the server
  console.log(x.response.responseData)
});
