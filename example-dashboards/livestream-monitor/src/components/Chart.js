import React from 'react';
import Highcharts from 'react-highcharts';
import './Chart.css';

Highcharts.Highcharts.setOptions({ global: { useUTC: false } });

export default function Chart({ loading, config, title }) {
  const wrapperClasses = ['Chart'];
  if (loading) {
    wrapperClasses.push('loading');
  }

  return (
    <div className={wrapperClasses.join(' ')}>
      <h2>{title}</h2>
      <div class="highchartsContainer">
        <Highcharts config={config} isPureConfig />
      </div>
    </div>
  );
}
