const readline = require('readline');
const moment = require('moment');
const babar = require('babar');
const Bitmovin = require('bitmovin-javascript').default;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.question('Please enter your Bitmovin API Key: ', (apiKey) => {
  const bitmovin = new Bitmovin({ 'apiKey': apiKey });

  // Query the Median Startuptime of the Player
  // Note: STARTUPTIME = PLAYER_STARTUPTIME + VIDEO_STARTUPTIME
  const from = moment().add(-7, 'days').toDate();
  const to = moment().toDate();

  // Query the xth Percentile of the Startuptime
  const getPercentile = percentile => {
    const query = bitmovin.analytics.queries.builder.percentile('STARTUPTIME', percentile)
      .between(from, to)
      .interval('DAY')
      .filter('STARTUPTIME', 'GT', 0)
       // Important - check that we are only looking at foreground loaded impressions
      .filter('PAGE_LOAD_TYPE', 'EQ', 1)
      .orderBy('DAY', 'DESC')
      .query() // this returns a JavaScript Promise

    return query.then((results) => {
      return results.rows.map(mapFirstRowToReadableDateTimeFormat);
    });
  }
  Promise.all([getPercentile(50), getPercentile(90), getPercentile(95)]).then(results => {
    const p50 = results[0];
    const p90 = results[1];
    const p95 = results[2];
    console.log(babar(p50, { caption: 'Median Startuptime' }));
    console.log("Legend: x - Days since today, y - milliseconds");
    console.log(babar(p90, { caption: 'p90 Startuptime' }));
    console.log("Legend: x - Days since today, y - milliseconds");
    console.log(babar(p95, { caption: 'p95 Startuptime' }));
    console.log("Legend: x - Days since today, y - milliseconds");
  });

  const mapFirstRowToReadableDateTimeFormat = (row) => {
    row[0] = moment(row[0]).diff(moment(), 'days');
    return row;
  }
  rl.close();
});
