import React, { PureComponent } from 'react';

export default class VideoStats extends PureComponent {
  state = {
    data: [],
    loading: true,
  }

  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.videoId !== newProps.videoId) {
      this.setState({ loading: true });
    }
    if (newProps !== this.props) {
      this.loadData(newProps);
    }
  }

  loadData = async ({ queryBuilder, videoId, from, to, licenseKey, queryExtension, dataProcessor, count }) => {
    const filters = [['IS_LIVE', 'EQ', true]];

    let query = queryBuilder.count(count)
      .licenseKey(licenseKey)
      .between(from, to)
      .interval('MINUTE')

    if (queryExtension) {
      query = queryExtension(query);
    }

    if (videoId) {
      filters.push(['VIDEO_ID', 'EQ', videoId]);
    }

    const filteredQuery = filters.reduce((q, params) => q.filter(...params), query)

    let { rows } = await filteredQuery.query();
    if (dataProcessor) {
      rows = dataProcessor(rows);
    }
    const data = rows.sort((a, b) => a[0] - b[0]);

    this.setState({ data, loading: false });
  }

  render() {
    const { data, loading } = this.state;
    const { from, to } = this.props;
    return React.cloneElement(this.props.children, { loading, data, from, to })
  }
}
