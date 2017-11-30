import React, { PureComponent } from 'react';
import ErrorChart from './ErrorChart.js';

const seconds = 1000;
const minutes = 60 * seconds;

export default class ErrorAnalytics extends PureComponent {
  state = {
    errorCounts: [],
    loading: true,
  }

  componentDidMount() {
    this.loadErrorCounts(this.props);
  }

  componentDidUpdate(newProps) {
    if (newProps !== this.props) {
      this.loadErrorCounts(newProps);
    }
  }

  loadErrorCounts = async ({ queryBuilder, currentVideoId, from, to, licenseKey }) => {
    const filters = [['IS_LIVE', 'EQ', true]];

    const query = queryBuilder.count('IMPRESSION_ID')
      .licenseKey(licenseKey)
      .between(from, to)
      .groupBy('ERROR_CODE')
      .interval('MINUTE')

    if (currentVideoId) {
      filters.push(['VIDEO_ID', 'EQ', currentVideoId]);
    }

    const filteredQuery = filters.reduce((q, params) => q.filter(...params), query)

    const { rows } = await filteredQuery.query();
    const errorCounts = rows
      .filter(([timestamp, error, count]) => error !== null)
      .sort((a, b) => a[0] - b[0]);

    this.setState({ errorCounts, loading: false });
  }

  render() {
    const { errorCounts, loading } = this.state;
    const { from, to } = this.props;

    return <ErrorChart loading={loading} errorCounts={errorCounts} from={from} to={to} />;
  }
}
