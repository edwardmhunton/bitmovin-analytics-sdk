import React, { Component } from 'react';
import { Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import DateRangeSelection, { initialDateRange } from './DateRangeSelection.js';
import ComparisonTable from './ComparisonTable.js';
import './Main.css';

export default class Main extends Component {
  state = {
    currentLicenseId: this.props.licenses[0].id,
    fromDate: initialDateRange.fromDate(),
    toDate: initialDateRange.toDate(),
  };

  handleLicenseChange = (event) => {
    const currentLicenseId = event.currentTarget.value;
    this.setState({ currentLicenseId });
  }

  handleDateRangeChange = ({ fromDate, toDate }) =>
    this.setState({ fromDate, toDate });

  render() {
    const { licenses, apiKey } = this.props;
    console.log(licenses);
    const { fromDate, toDate, currentLicenseId } = this.state;
    console.log(currentLicenseId);
    const { licenseKey } = licenses.find(l => l.id === currentLicenseId);

    return (
      <Panel className="Main-container">
        <form>
          <div className="Main-titleRow">
            <h1>Compare</h1>
            <FormGroup controlId="formControlsSelect" bsSize="small">
              <ControlLabel>License</ControlLabel>
              <FormControl componentClass="select" placeholder="select" value={currentLicenseId} onChange={this.handleLicenseChange}>
                {licenses.map(({ id, name, licenseKey }) =>
                  <option value={id} key={id}>
                    {name || licenseKey}
                  </option>)}
              </FormControl>
            </FormGroup>
          </div>
          <DateRangeSelection fromDate={fromDate} toDate={toDate} onChange={this.handleDateRangeChange}/>
          <ComparisonTable fromDate={fromDate} toDate={toDate} apiKey={apiKey} licenseKey={licenseKey} />
        </form>
      </Panel>
    );
  }
}
