import React, { Component } from 'react';
import TimeCell from './TimeCell.js';

const dimensionNames = {
  STARTUPTIME: 'Total Startup Time',
  PLAYER_STARTUPTIME: 'Player Startup Time',
  VIDEO_STARTUPTIME: 'Video Startup Time',
}
const aggregationName = ({ aggregation, aggregationParam }) => {
  switch (aggregation) {
    case 'percentile':
      return `${aggregationParam}th percentile`;
    default:
      return aggregation;
  }
}
const nameForQuery = (query) => {
  return `${dimensionNames[query.dimension]} (${aggregationName(query)})`;
}
export default class TimeRow extends Component {
  state = {
    values: [],
  }

  constructor(props) {
    super(props);
    this.fetchAnalytics(props);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ values: [] });
    this.fetchAnalytics(newProps);
  }

  fetchAnalytics = async ({ query, columnKeys, queryBuilder }) => {
      const { aggregation, dimension, aggregationParam, licenseKey, fromDate, toDate, comparableKey } = query;
      const runningQueries = columnKeys.map(columnKey => {
        return queryBuilder[aggregation](dimension, aggregationParam)
          .licenseKey(licenseKey)
          .between(fromDate, toDate)
          .filter(comparableKey, 'EQ', columnKey)
          .filter(dimension, 'GT', 0)
          .filter('PAGE_LOAD_TYPE', 'EQ', 1)
          .query();
      })

      const queryResults = await Promise.all(runningQueries);
      const values = queryResults.map(({ rows }) => rows[0] ? rows[0][0] : null);

      this.setState({ values });
    }

  render() {
    const { columnKeys, query } = this.props;
    const { values } = this.state;
    const isLoading = values.length !== columnKeys.length;

    return (
      <tr>
        <td>{nameForQuery(query)}</td>
        {columnKeys.map((key, index) =>
          <TimeCell key={key} value={values[index]} loading={isLoading} />
        )}
      </tr>
    );
  }
}
