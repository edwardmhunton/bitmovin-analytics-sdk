import React, { Component } from 'react';
import Bitmovin from 'bitmovin-javascript';
import { Panel } from 'react-bootstrap';
import LicenseKeySelect from './LicenseKeySelect.js';
import UserChart from './UserChart.js';
import VideoSelect from './VideoSelect.js';
import './Main.css';

const seconds = 1000;
const minutes = 60 * seconds;

export default class Main extends Component {
  state = {
    queryBuilder: new Bitmovin({ apiKey: this.props.apiKey }).analytics.queries.builder,
    userCounts: [],
    videoIds: [],
    currentVideoId: '',
    loading: true,
  };

  componentDidMount() {
    this.tickData();
    setInterval(this.tickData, 30 * seconds);
  }

  componentDidUpdate(prevProps, prevState) {
    const stateChanged = (attr) => prevState[attr] !== this.state[attr];

    if (stateChanged('currentVideoId')) {
      this.loadUserCounts();
    }
    if (stateChanged('from') || stateChanged('to')) {
      this.loadUserCounts();
      this.loadVideos();
    }
  }

  loadUserCounts = async () => {
    const { queryBuilder, currentVideoId, from, to } = this.state;
    const filters = [['IS_LIVE', 'EQ', true]];

    const query = queryBuilder.count('USER_ID')
      .licenseKey(this.currentLicenseKey())
      .between(from, to)
      .interval('MINUTE')

    if (currentVideoId) {
      filters.push(['VIDEO_ID', 'EQ', currentVideoId]);
    }

    const filteredQuery = filters.reduce((q, params) => q.filter(...params), query)

    const { rows } = await filteredQuery.query();

    // fill minutes without users
    const lastMinute = new Date(to.getTime())
    lastMinute.setSeconds(0);
    lastMinute.setMilliseconds(0);
    const minutesArray = new Array(15)
      .fill(lastMinute)
      .map((minute, index) => minute.getTime() - index * minutes);

    const userCounts = minutesArray
      .map(minute => rows.find((row) => row[0] === minute) || [minute, 0]);

    this.setState({ userCounts, loading: false });
  }

  loadVideos = async () => {
    const { queryBuilder, from, to } = this.state;
    const { rows } = await queryBuilder.count('USER_ID')
      .licenseKey(this.currentLicenseKey())
      .between(from, to)
      .filter('IS_LIVE', 'EQ', true)
      .groupBy('VIDEO_ID')
      .query();

    const videoIds = rows.map(row => row[0]);

    this.setState({ videoIds });
  }

  tickData = () => {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * minutes);
    this.setState({ from: fifteenMinutesAgo, to: now });
  }

  currentLicenseKey = () => {
    const currentLicenseKey = localStorage.getItem('licenseKey');
    const { licenses } = this.props;
    const { licenseKey } = licenses.find(l => l.licenseKey === currentLicenseKey) || licenses[0];

    if (licenseKey !== currentLicenseKey) {
      this.setLicenseKey(licenseKey);
    }

    return licenseKey;
  }

  setLicenseKey = (licenseKey) => {
    localStorage.setItem('licenseKey', licenseKey);
    this.forceUpdate();
  }

  handleLicenseChange = (event) => this.setLicenseKey(event.currentTarget.value)

  handleVideoIdChange = (event) =>
    this.setState({ currentVideoId: event.currentTarget.value, loading: true });

  render() {
    const { licenses } = this.props;
    const { userCounts, currentVideoId, loading, videoIds } = this.state;
    const currentLicenseKey = this.currentLicenseKey();
    const data = userCounts.sort((a, b) => a[0] - b[0])


    return (
      <div className="Main">
        {licenses.length > 1 && <LicenseKeySelect
          currentLicenseKey={currentLicenseKey}
          handleLicenseChange={this.handleLicenseChange}
          licenses={licenses}
        />}
        <Panel>
          <form>
            <div className="Main-titleRow">
              <h1>Livestream monitoring</h1>
              <VideoSelect
                currentVideoId={currentVideoId}
                handleVideoIdChange={this.handleVideoIdChange}
                videoIds={videoIds}
                disabled={loading}
              />
            </div>
            <UserChart loading={loading} data={data} />
          </form>
        </Panel>
      </div>
    );
  }
}
