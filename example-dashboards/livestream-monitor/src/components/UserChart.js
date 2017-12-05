import React from 'react';
import Chart from './Chart.js';

export default function UserChart({ loading, data, from, to}) {
  const config = {
    chart: {
      type: 'column',
      height: '30%',
    },
    title: {
      text: null,
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

  return <Chart config={config} title="Audience" loading={loading} />
}
