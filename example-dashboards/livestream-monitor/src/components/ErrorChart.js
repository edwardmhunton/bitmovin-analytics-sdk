import React from 'react';
import Highcharts from 'react-highcharts';

export default function ErrorChart({ loading, errorCounts, from, to }) {
  const seriesArray = [];

  errorCounts.forEach(([timestamp, errorCode, count]) => {
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

  const coloredSeriesArray = seriesArray.map((series, index) => {
    const lightness = (75 - 25 * (index / seriesArray.length));
    return { ...series, color: `hsl(3, 85%, ${lightness}%)` }
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
        dataLabels: {
          enabled: true,
          color: 'white',
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
        text: 'Viewers',
      },
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
      <Highcharts config={config} />
    </div>
  );
}
