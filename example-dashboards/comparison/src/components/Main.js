import React, { Component } from 'react';
import { Panel, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import DateRangeSelection, { initialDateRange } from './DateRangeSelection.js';

export default class Main extends Component {
  state = {
    currentLicenseId: this.props.licenses[0].id,
    fromDate: initialDateRange.fromDate(),
    toDate: initialDateRange.toDate(),
  };

  handleLicenseChange = (event, index, id) => this.setState({ currentLicenseId: id });

  handleDateRangeChange = ({ fromDate, toDate }) =>
    this.setState({ fromDate, toDate });

  render() {
    const { licenses } = this.props;
    const { fromDate, toDate, currentLicenseId } = this.state;
    return (
      <Panel style={{
        margin: '2rem auto',
        padding: '1rem 3rem',
        maxWidth: '50rem',
      }}>
        <form>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1 style={{ fontWeight: 500, fontSize: '2rem', color: '#666' }}>Compare</h1>
            <FormGroup controlId="formControlsSelect">
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
        </form>
      </Panel>
    );
  }
}
