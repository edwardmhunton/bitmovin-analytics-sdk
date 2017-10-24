import Bitmovin from 'bitmovin-javascript';
import $ from 'jquery';
import moment from 'moment';
import Highcharts from 'highcharts';

const retrieveAnalyticsData = (apiKey, includeBackground) => {
  const bitmovin = new Bitmovin({ 'apiKey': apiKey });

  const mapFirstRowToReadableDateTimeFormat = (row) => {
    row[0] = moment(row[0]).valueOf();
    return row;
  };

  // Query the Median Startuptime of the Player
  // Note: STARTUPTIME = PLAYER_STARTUPTIME + VIDEO_STARTUPTIME
  const from = moment().add(-7, 'days').toDate();
  const to = moment().toDate();

  // Query the xth Percentile of the Startuptime
  const getPercentile = percentile => {
    let queryBuilder = bitmovin.analytics.queries.builder.percentile('PLAYER_STARTUPTIME', percentile)
      .between(from, to)
      .interval('DAY')
      .filter('PLAYER_STARTUPTIME', 'GT', 0)
      .orderBy('DAY', 'DESC')
    if (includeBackground === false) {
       // Important - check that we are only looking at foreground loaded impressions
      queryBuilder = queryBuilder.filter('PAGE_LOAD_TYPE', 'EQ', 1);
    }
    const query = queryBuilder.query() // this returns a JavaScript Promise

    return query.then((results) => {
      return [percentile, results.rows.map(mapFirstRowToReadableDateTimeFormat)]
    });
  }
  return Promise.all([getPercentile(50), getPercentile(90), getPercentile(95)]);
};

const render = (data) => {
  Highcharts.chart('chart', {
    title: { text: "Player Startuptime" },
    yAxis: { title: { text: "Milliseconds" } },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Date'
      }
    },
    plotOptions: {
      series: {
        label: { connectorAllowed: false }
      }
    },
    series: data
  });
}

const formatAsSeries = (data) => {
  return data.map(row => {
    return {
      name: 'p' + row[0],
      data: row[1]
    };
  });
}


$(document).ready(() => {
  $('#load').click(function () {
    const key = $('#apiKey').val();
    const background = $('#includeBackground').is(':checked');
    retrieveAnalyticsData(key, background)
      .then(formatAsSeries)
      .then((data) => {
        console.log(data)
        render(data);
      });
  });
});

