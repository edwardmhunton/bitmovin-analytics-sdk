import React, { PureComponent } from 'react';
import UserChart from './UserChart.js';

const seconds = 1000;
const minutes = 60 * seconds;

export default class UserAnalytics extends PureComponent {
  state = {
    userCounts: [],
    loading: true,
  }

  componentDidMount() {
    this.loadUserCounts(this.props);
  }

  componentDidUpdate(newProps) {
    if (newProps !== this.props) {
      this.loadUserCounts(newProps);
    }
  }

  loadUserCounts = async ({ queryBuilder, currentVideoId, from, to, licenseKey }) => {
    const filters = [['IS_LIVE', 'EQ', true]];

    const query = queryBuilder.count('USER_ID')
      .licenseKey(licenseKey)
      .between(from, to)
      .interval('MINUTE')

    if (currentVideoId) {
      filters.push(['VIDEO_ID', 'EQ', currentVideoId]);
    }

    const filteredQuery = filters.reduce((q, params) => q.filter(...params), query)

    const { rows } = await filteredQuery.query();
    const userCounts = rows.sort((a, b) => a[0] - b[0]);

    this.setState({ userCounts, loading: false });
  }

  render() {
    const { userCounts, loading } = this.state;
    const { from, to } = this.props;
    return <UserChart loading={loading} userCounts={userCounts} from={from} to={to} />;
  }
}
