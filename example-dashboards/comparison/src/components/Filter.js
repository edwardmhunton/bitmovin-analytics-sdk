import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './Filter.css';

export default class Filter extends Component {
  state = {
    filterOptions: [],
  };

  constructor(props) {
    super();
    this.fetchFilterOptions(props);
  }

  fetchFilterOptions = async ({ queryBuilder, licenseKey, fromDate, toDate, attribute }) => {
    const { rows } = await queryBuilder
      .count('IMPRESSION_ID')
      .licenseKey(licenseKey)
      .between(fromDate, toDate)
      .groupBy(attribute)
      .query();
    const filterOptions = rows.sort((a, b) => b[1] - a[1]).map(r => r[0]);
    this.setState({ filterOptions });
    this.props.onChange(filterOptions[0]);
  };

  handleChange = (event) => {
    this.props.onChange(event.currentTarget.value);
  };

  render() {
    const { attribute, value } = this.props;
    const { filterOptions } = this.state;

    return (
      <FormGroup controlId={`${attribute}Filter`} className="Filter"  bsSize="small">
        <ControlLabel>{attribute}</ControlLabel>
        <FormControl
          componentClass="select"
          placeholder="select"
          value={value || filterOptions[0] || ''}
          onChange={this.handleChange}
          disabled={false}
        >
          {filterOptions.map((option) =>
            <option value={option} key={option}>{option || 'None'}</option>)}
        </FormControl>
      </FormGroup>
    )
  }
}
