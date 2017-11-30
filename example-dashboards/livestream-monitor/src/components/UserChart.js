import React from 'react';
import Highcharts from 'react-highcharts';
import './UserChart.css';

export default function UserChart({ loading, userCounts: data, from, to}) {
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
