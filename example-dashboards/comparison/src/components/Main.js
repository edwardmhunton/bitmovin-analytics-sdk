import React, { Component } from 'react';
import { Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import DateRangeSelection, { initialDateRange } from './DateRangeSelection.js';
import ComparisonTable from './ComparisonTable.js';
import './Main.css';

export default class Main extends Component {
  state = {
    fromDate: initialDateRange.fromDate(),
    toDate: initialDateRange.toDate(),
  };

  currentLicenseKey = () => localStorage.getItem('licenseKey') || this.props.licenses[0].licenseKey;

  handleLicenseChange = (event) => {
    localStorage.setItem('licenseKey', event.currentTarget.value)
    this.forceUpdate();
  }

  handleDateRangeChange = ({ fromDate, toDate }) =>
    this.setState({ fromDate, toDate });

  render() {
    const { licenses, apiKey } = this.props;
    const { fromDate, toDate } = this.state;
    const currentLicenseKey = this.currentLicenseKey();

    return (
      <Panel className="Main-container">
        <form>
          <div className="Main-titleRow">
            <h1>Compare</h1>
            <FormGroup controlId="formControlsSelect" bsSize="small">
              <ControlLabel>License</ControlLabel>
              <FormControl
                componentClass="select"
                placeholder="select"
                value={currentLicenseKey}
                onChange={this.handleLicenseChange}
              >
                {licenses.map(({ name, licenseKey }) =>
                  <option value={licenseKey} key={licenseKey}>
                    {name || licenseKey}
                  </option>)}
              </FormControl>
            </FormGroup>
          </div>
          <DateRangeSelection fromDate={fromDate} toDate={toDate} onChange={this.handleDateRangeChange}/>
          <ComparisonTable fromDate={fromDate} toDate={toDate} apiKey={apiKey} licenseKey={currentLicenseKey} />
        </form>
      </Panel>
    );
  }
}
