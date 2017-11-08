import React, { Component } from 'react';

export default class CountryCell extends Component {
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

  fetchAnalytics = async ({ fromDate, toDate, licenseKey, country, queryBuilder, aggregation,
    dimension, aggregationParam }) => {
      const { rows } = await queryBuilder[aggregation](dimension, aggregationParam)
        .licenseKey(licenseKey)
        .between(fromDate, toDate)
        .filter('COUNTRY', 'EQ', country)
        .filter(dimension, 'GT', 0)
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
