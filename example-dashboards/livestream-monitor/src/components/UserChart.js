import React from 'react';
import Highcharts from 'react-highcharts';
import './UserChart.css';

export default function UserChart({ loading, data }) {
  const config = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Audience',
    },
    xAxis: {
      type: 'datetime',
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
