import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button, OverlayTrigger, Popover, FormGroup, ControlLabel } from 'react-bootstrap';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangeSelection.css';

const dateRanges = Object.freeze([
  Object.freeze({
    label: 'Last 24 hours',
    fromDate: () => moment().startOf('day').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 3 days',
    fromDate: () => moment().startOf('day').subtract(3, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 7 days',
    fromDate: () => moment().startOf('day').subtract(7, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 14 days',
    fromDate: () => moment().startOf('day').subtract(14, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 30 days',
    fromDate: () => moment().startOf('day').subtract(30, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
]);

export const initialDateRange = dateRanges[2];

export default class DateRangeSelection extends Component {
  state = {
    label: initialDateRange.label,
  }

  handleDateChange = (attr) => (dateMoment) => {
    const { fromDate, toDate, onChange } = this.props;
    const update = { [attr]: dateMoment.toDate() };
    onChange({ fromDate, toDate, ...update });
    this.setState({ label: `${moment(fromDate).format('L')} – ${moment(toDate).format('L')}`})
  }

  selectRange = (label) => () => {
    const range = dateRanges.find(r => r.label === label);
    this.props.onChange({ fromDate: range.fromDate(), toDate: range.toDate() });
    this.setState({ label: range.label });
  }

  render() {
    const { fromDate, toDate } = this.props;
    const { label } = this.state;

    const dateRangePopover = (
      <Popover id="DateRangeSelection-popover">
        <div className="DateRangeSelection-dateSelection">
          <FormGroup controlId="fromDate">
            <ControlLabel>From</ControlLabel>
            <DatePicker
              selected={moment(fromDate)}
              onChange={this.handleDateChange('fromDate')}
            />
          </FormGroup>
          <FormGroup controlId="toDate">
            <ControlLabel>To</ControlLabel>
            <DatePicker
              selected={moment(toDate)}
              onChange={this.handleDateChange('toDate')}
            />
          </FormGroup>
        </div>
        <div>
          {dateRanges.map(({ label }) =>
            <Button key={label} onClick={this.selectRange(label)}>{label}</Button>)}
        </div>
      </Popover>
    );

    return (
      <div>
        <OverlayTrigger trigger="click" placement="bottom" overlay={dateRangePopover}>
          <Button>{label}</Button>
        </OverlayTrigger>
      </div>
    );
  }
}
