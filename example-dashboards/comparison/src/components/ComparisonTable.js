import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import Bitmovin from 'bitmovin-javascript';

export default class ComparisonTable extends Component {
  constructor({ apiKey, licenseKey, fromDate, toDate }) {
    super();
    console.log(apiKey);
    const bitmovin = new Bitmovin({ apiKey, debug: true });
    this.state = {
      queryBuilder: bitmovin.analytics.queries.builder,
    };
    this.fetchAnalytics({ fromDate, toDate, licenseKey });
  }

  fetchAnalytics = async ({ fromDate, toDate, licenseKey }) => {
    console.log(fromDate, toDate);
    const startupTime = await this.state.queryBuilder
      .avg('STARTUPTIME')
      //.between(fromDate, toDate)
      //.filter('LICENSE_KEY', 'EQ', licenseKey)
      .query();
    console.log(startupTime);
  }

  componentWillReceiveProps({ fromDate, toDate, licenseKey }) {
    this.fetchAnalytics({ fromDate, toDate, licenseKey });
  }

  render() {
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
            <td>Video Startup Time (median)</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}
