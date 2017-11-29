import React, { Component } from 'react';
import Bitmovin from 'bitmovin-javascript';
import Highcharts from 'react-highcharts';
import { Panel } from 'react-bootstrap';
import LicenseKeySelect from './LicenseKeySelect.js';
import './Main.css';

const seconds = 1000;
const minutes = 60 * seconds;

export default class Main extends Component {
  state = {
    queryBuilder: new Bitmovin({ apiKey: this.props.apiKey }).analytics.queries.builder,
    userCounts: [],
  };

  componentDidMount() {
    this.loadUserCounts();
    setInterval(this.loadUserCounts, 30 * seconds);
  }

  loadUserCounts = async () => {
    const { queryBuilder } = this.state;
    const now = new Date();
    const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * minutes);
    const { rows } = await queryBuilder.count('USER_ID')
      .licenseKey(this.currentLicenseKey())
      .between(fifteenMinutesAgo, now)
      .filter('IS_LIVE', 'EQ', true)
      .interval('MINUTE')
      .query();

    // fill minutes with no users
    const lastMinute = new Date(now.getTime())
    lastMinute.setSeconds(0);
    lastMinute.setMilliseconds(0);
    const minutesArray = new Array(15)
      .fill(lastMinute)
      .map((minute, index) => minute.getTime() - index * minutes);

    const userCounts = minutesArray
      .map(minute => rows.find((row) => row[0] === minute) || [minute, 0]);

    this.setState({ userCounts });
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

  render() {
    const { licenses } = this.props;
    const { userCounts } = this.state;
    const currentLicenseKey = this.currentLicenseKey();
    const data = userCounts
      .sort((a, b) => a[0] - b[0])

    const config = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Audience',
      },
      xAxis: {
        type: 'datetime',
      },
      series: [{
        name: 'Users watching',
        data
      }],
    };

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
            </div>
            <Highcharts config={config} />
          </form>
        </Panel>
      </div>
    );
  }
}
