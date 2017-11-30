import React from 'react';
import Highcharts from 'react-highcharts';

export default function ErrorChart({ loading, data, from, to, onSelectTimestamp }) {
  const seriesArray = [];

  data.forEach(([timestamp, errorCode, count]) => {
    const errorCodeString = `${errorCode}`;
    let series = seriesArray.find(({ name }) => name === errorCodeString);
    if (!series) {
      series = {
        name: errorCodeString,
        data: []
      };
      seriesArray.push(series);
    }

    series.data = [...series.data, [timestamp, count]]
  });

  const sortedSeriesArray = seriesArray.sort((a, b) => a.name < b.name ? -1 : 1);

  const coloredSeriesArray = sortedSeriesArray.map((series, index) => {
    const lightness = (75 - 35 * (index / seriesArray.length));
    return { ...series, color: `hsl(3, 82%, ${lightness}%)` }
  })

  const config = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Errors',
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        events: {
          click(event) {
            console.log('clicked', event.point);
            onSelectTimestamp(event.point.x)
          }
        }
      }
    },
    xAxis: {
      type: 'datetime',
      min: from.getTime(),
      max: to.getTime(),
    },
    yAxis: {
      min: 0,
      allowDecimals: false,
      title: {
        text: 'Impressions with errors',
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'gray',
        }
      }
    },
    legend: {
      enabled: false
    },
    series: coloredSeriesArray,
  };

  const wrapperClasses = ['UserChart'];
  if (loading) {
    wrapperClasses.push('loading');
  }

  return (
    <div className={wrapperClasses.join(' ')}>
      <Highcharts config={config} isPureConfig />
    </div>
  );
}
