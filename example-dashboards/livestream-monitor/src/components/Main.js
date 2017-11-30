import React, { Component } from 'react';
import Bitmovin from 'bitmovin-javascript';
import { Panel } from 'react-bootstrap';
import LicenseKeySelect from './LicenseKeySelect.js';
import VideoSelect from './VideoSelect.js';
import VideoStats from './VideoStats.js';
import UserChart from './UserChart.js';
import ErrorChart from './ErrorChart.js';
import ErrorTable from './ErrorTable.js';
import './Main.css';

const seconds = 1000;
const minutes = 60 * seconds;

const currentTimeInterval = () => {
  const to = new Date();
  to.setSeconds(0);
  to.setMilliseconds(0);

  return { from: new Date(to.getTime() - 15 * minutes), to }
};

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
    this.setState({ currentVideoId: event.currentTarget.value });

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
            <VideoStats
              queryBuilder={queryBuilder}
              licenseKey={currentLicenseKey}
              videoId={currentVideoId}
              from={from}
              to={to}
              count="USER_ID"
            >
              <UserChart />
            </VideoStats>
            <VideoStats
              queryBuilder={queryBuilder}
              licenseKey={currentLicenseKey}
              videoId={currentVideoId}
              from={from}
              to={to}
              count="IMPRESSION_ID"
              queryExtension={(query) => query.groupBy('ERROR_CODE')}
              dataProcessor={(data) => data.filter(([timestamp, error, count]) => error !== null)}
            >
              <ErrorChart />
              <ErrorTable />
            </VideoStats>
          </form>
        </Panel>
      </div>
    );
  }
}
