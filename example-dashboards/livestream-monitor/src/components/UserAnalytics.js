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

  componentWillReceiveProps(newProps) {
    if (this.props.videoId !== newProps.videoId) {
      this.setState({ loading: true });
    }
    if (newProps !== this.props) {
      this.loadUserCounts(newProps);
    }
  }

  loadUserCounts = async ({ queryBuilder, videoId, from, to, licenseKey }) => {
    const filters = [['IS_LIVE', 'EQ', true]];

    const query = queryBuilder.count('USER_ID')
      .licenseKey(licenseKey)
      .between(from, to)
      .interval('MINUTE')

    if (videoId) {
      filters.push(['VIDEO_ID', 'EQ', videoId]);
    }

    const filteredQuery = filters.reduce((q, params) => q.filter(...params), query)

    const { rows } = await filteredQuery.query();
    const userCounts = rows.sort((a, b) => a[0] - b[0]);
    console.log(filters, rows);

    this.setState({ userCounts, loading: false });
  }

  render() {
    const { userCounts, loading } = this.state;
    const { from, to } = this.props;
    return <UserChart loading={loading} userCounts={userCounts} from={from} to={to} />;
  }
}
