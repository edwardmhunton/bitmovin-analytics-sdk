import React, { Component } from 'react';
import Bitmovin from 'bitmovin-javascript';
import { Panel } from 'react-bootstrap';
import LicenseKeySelect from './LicenseKeySelect.js';
import './Main.css';

export default class Main extends Component {

  state = {
    queryBuilder: new Bitmovin({ apiKey: this.props.apiKey }).analytics.queries.builder,
  };

  currentLicenseKey = () => localStorage.getItem('licenseKey') || this.props.licenses[0].licenseKey;

  handleLicenseChange = (event) => {
    localStorage.setItem('licenseKey', event.currentTarget.value)
    this.forceUpdate();
  }

  render() {
    const { licenses } = this.props;
    const { queryBuilder } = this.state;
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
            </div>
          </form>
        </Panel>
      </div>
    );
  }
}
