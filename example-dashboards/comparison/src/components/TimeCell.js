import React, { Component } from 'react';

export default class TimeCell extends Component {
  state = {
    value: null,
  }

  constructor(props) {
    super(props);
    this.fetchAnalytics(props);
  }

  componentWillReceiveProps(newProps) {
    this.fetchAnalytics(newProps);
  }

  fetchAnalytics = async ({ fromDate, toDate, licenseKey, columnKey, queryBuilder, aggregation,
    dimension, aggregationParam, comparableKey }) => {
      const { rows } = await queryBuilder[aggregation](dimension, aggregationParam)
        .licenseKey(licenseKey)
        .between(fromDate, toDate)
        .filter(comparableKey, 'EQ', columnKey)
        .filter(dimension, 'GT', 0)
        .filter('PAGE_LOAD_TYPE', 'EQ', 1)
        .query();

      const value = rows[0] ? rows[0][0] : null;

      this.setState({ value });
    }

  render() {
    const { value } = this.state;

    return (
      <td>
        {value ? `${(value / 1000).toFixed(2)}s` : 'N/A'}
      </td>
    );
  }
}
