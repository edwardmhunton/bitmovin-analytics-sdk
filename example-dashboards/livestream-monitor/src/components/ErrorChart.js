import React from 'react';
import Chart from './Chart.js';
import './ErrorChart.css';

export default function ErrorChart({ loading, data, from, to, onSelectTimestamp, onSelectSeriesName, selectedSeriesName, selectedTimestamp }) {
  const seriesArray = [];

  data.forEach(([timestamp, errorCode, count]) => {
    const errorCodeString = `${errorCode}`;
    let series = seriesArray.find(({ name }) => name === errorCodeString);
    if (!series) {
      series = {
        name: errorCodeString,
        data: [],
      };
      seriesArray.push(series);
    }

    series.data = [...series.data, { x: timestamp, y: count }];
  });

  const sortedSeriesArray = seriesArray.sort((a, b) => a.name < b.name ? -1 : 1);

  const coloredSeriesArray = sortedSeriesArray.map((series, index) => {
    const lightness = (75 - 35 * (index / seriesArray.length));
    return { ...series, color: `hsl(3, 82%, ${lightness}%)`, cursor: 'pointer' };
  })

  const highlightedSeries = coloredSeriesArray.map((series, index) =>
    series.name === selectedSeriesName ? { ...series, className: 'selectedSeries' } : series);

  // highlighted column
  if (selectedTimestamp) {
    seriesArray.forEach(series => {
      series.data
        .filter(({ x }) => x !== selectedTimestamp)
        .forEach(item => item.className = 'deselectedColumn')
    })
  }

  const config = {
    chart: {
      type: 'column',
      height: '30%',
    },
    title: {
      text: null,
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        events: {
          click(event) {
            const { x, series } = event.point;
            const seriesName = `${series.name}`;
            onSelectTimestamp(x);
            onSelectSeriesName(seriesName);
          },
        },
        states: {
          hover: {
            color: 'black',
          }
        }
      },
      series: {
        animation: {
          duration: 2000,
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
          color: '#AAA',
        }
      }
    },
    legend: {
      enabled: false
    },
    series: highlightedSeries,
  };

  return <Chart config={config} title="Errors" loading={loading} />
}
