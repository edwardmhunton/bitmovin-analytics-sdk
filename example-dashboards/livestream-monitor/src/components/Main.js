import React, { Component } from 'react';
import Bitmovin from 'bitmovin-javascript';
import { Panel } from 'react-bootstrap';
import LicenseKeySelect from './LicenseKeySelect.js';
import UserAnalytics from './UserAnalytics.js';
import ErrorAnalytics from './ErrorAnalytics.js';
import VideoSelect from './VideoSelect.js';
import './Main.css';

const seconds = 1000;
const minutes = 60 * seconds;

const currentTimeInterval = () => ({
  from: new Date(new Date().getTime() - 15 * minutes),
  to: new Date(),
});

export default class Main extends Component {
  state = {
    queryBuilder: new Bitmovin({ apiKey: this.props.apiKey }).analytics.queries.builder,
    userCounts: [],
    errorCounts: [],
    videoIds: [],
    currentVideoId: '',
    ...currentTimeInterval(),
  };

  componentDidMount() {
    this.tickData();
    setInterval(this.tickData, 30 * seconds);
  }

  componentDidUpdate(prevProps, prevState) {
    const stateChanged = (attr) => prevState[attr] !== this.state[attr];

    if (stateChanged('from') || stateChanged('to')) {
      this.loadVideos();
    }
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

  tickData = () => this.setState(currentTimeInterval());

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
    const { queryBuilder, currentVideoId, videoIds, from, to } = this.state;
    const currentLicenseKey = this.currentLicenseKey();

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
              />
            </div>
            <UserAnalytics
              queryBuilder={queryBuilder}
              licenseKey={currentLicenseKey}
              currentVideoId={currentVideoId}
              from={from}
              to={to}
            />
            <h2>Errors</h2>
            <ErrorAnalytics
              queryBuilder={queryBuilder}
              licenseKey={currentLicenseKey}
              currentVideoId={currentVideoId}
              from={from}
              to={to}
            />
          </form>
        </Panel>
      </div>
    );
  }
}
