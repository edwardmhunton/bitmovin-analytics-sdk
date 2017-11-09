import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './ComparableSelect.css';

const comparables = [
  Object.freeze({ collectionName: 'countries', singleName: 'country', key: 'COUNTRY' }),
  Object.freeze({ collectionName: 'players', singleName: 'player', key: 'PLAYER' }),
];

export const initialComparableKey = comparables[0].key;

export const getSingleName = (key) => {
  const comparable = comparables.find(c => c.key === key);
  return comparable ? comparable.singleName : null;
}

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
          {comparables.map(({ collectionName, key }) =>
            <option value={key} key={key}>{collectionName}</option>)}
        </FormControl>
      </FormGroup>
    );
  }
}
