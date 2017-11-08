import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './ComparableSelect.css';

const comparables = [
  Object.freeze({ name: 'Countries', key: 'countries' }),
  Object.freeze({ name: 'Player versions', key: 'players' }),
];

export const initialComparableKey = comparables[0].key;

export default class ComparableSelect extends Component {
  handleChange = event => this.props.onChange(event.currentTarget.value);

  render() {
    const { comparableKey } = this.props;

    return (
      <FormGroup controlId="comparableSelect" className="ComparableSelect">
        <ControlLabel>Compare</ControlLabel>
        <FormControl
          componentClass="select"
          placeholder="select"
          value={comparableKey}
          onChange={this.handleChange}
        >
          {comparables.map(({ name, key }) => <option value={key} key={key}>{name}</option>)}
        </FormControl>
      </FormGroup>
    );
  }
}
