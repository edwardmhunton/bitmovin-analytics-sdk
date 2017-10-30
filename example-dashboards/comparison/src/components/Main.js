import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
    const { fromDate, toDate } = this.state;
    return (
      <Paper zDepth={1} style={{
        margin: '2rem auto',
        padding: '1rem 3rem',
        maxWidth: '50rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1 style={{ fontWeight: 500, fontSize: '2rem', color: '#666' }}>Compare</h1>
          <SelectField
            floatingLabelText="License"
            value={this.state.currentLicenseId}
            onChange={this.handleLicenseChange}
          >
            {licenses.map(({ id, name, licenseKey }) =>
              <MenuItem value={id} key={id} primaryText={name || licenseKey} />)}
          </SelectField>
        </div>
        <DateRangeSelection fromDate={fromDate} toDate={toDate} onChange={this.handleDateRangeChange}/>
      </Paper>
    );
  }
}
