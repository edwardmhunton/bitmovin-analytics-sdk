import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import Bitmovin from 'bitmovin-javascript';

export default class ComparisonTable extends Component {
  constructor({ apiKey, licenseKey, fromDate, toDate }) {
    super();
    console.log(apiKey);
    const bitmovin = new Bitmovin({ apiKey });
    this.state = {
      queryBuilder: bitmovin.analytics.queries.builder,
      countries: ['US'],
      countryStats: {},
    };
    this.fetchAnalytics({ fromDate, toDate, licenseKey });
  }

  fetchAnalytics = async ({ fromDate, toDate, licenseKey }) => {
    const { countries, queryBuilder } = this.state;
    const countryStats = {};

    countries.forEach(async (country) => {
      countryStats[country] = {};

      const { rows } = await queryBuilder
        .median('STARTUPTIME')
        .licenseKey(licenseKey)
        .between(fromDate, toDate)
        .filter('COUNTRY', 'EQ', country)
        .filter('STARTUPTIME', 'GT', 0)
        .query();

      const startupTime = rows[0] ? rows[0][0] : null;
      if (startupTime) {
        const startupTimeFormatted = `${(startupTime / 1000).toFixed(2)}s`;
        countryStats[country] = {
          ...countryStats[country],
          startupTimeMedian: startupTimeFormatted,
        };
      }

      this.setState({ countryStats });
    });
  }

  componentWillReceiveProps({ fromDate, toDate, licenseKey }) {
    this.fetchAnalytics({ fromDate, toDate, licenseKey });
  }

  render() {
    const { countries, countryStats } = this.state;

    return (
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>USA</th>
            <th>+</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Startup Time (median)</td>
            {countries.map(country =>
              <td key={`${country}-startupTime-median`}>
                {countryStats[country] && countryStats[country].startupTimeMedian || 'N/A'}
              </td>
            )}
          </tr>
        </tbody>
      </Table>
    );
  }
}
