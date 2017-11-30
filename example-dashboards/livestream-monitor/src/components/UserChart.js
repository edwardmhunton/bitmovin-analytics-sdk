import React from 'react';
import Chart from './Chart.js';

export default function UserChart({ loading, data, from, to}) {
  const config = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Audience',
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
    series: [{
      name: 'Users watching',
      data
    }],
  };

  return <Chart config={config} />
}
