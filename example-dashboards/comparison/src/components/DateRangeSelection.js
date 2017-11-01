import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button, ToggleButton, ToggleButtonGroup, OverlayTrigger, Popover, FormGroup, ControlLabel }
  from 'react-bootstrap';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangeSelection.css';

const dateRanges = Object.freeze([
  Object.freeze({
    label: 'Today',
    fromDate: () => moment().startOf('day').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 3 days',
    fromDate: () => moment().startOf('day').subtract(2, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 7 days',
    fromDate: () => moment().startOf('day').subtract(6, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 14 days',
    fromDate: () => moment().startOf('day').subtract(13, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
  Object.freeze({
    label: 'Last 30 days',
    fromDate: () => moment().startOf('day').subtract(29, 'days').toDate(),
    toDate: () => moment().endOf('day').toDate(),
  }),
]);

export const initialDateRange = dateRanges[2];

export default class DateRangeSelection extends Component {
  state = {
    currentLabel: initialDateRange.label,
  }

  handleDateChange = (attr) => (dateMoment) => {
    const { fromDate, toDate, onChange } = this.props;
    const update = { [attr]: dateMoment.toDate() };
    onChange({ fromDate, toDate, ...update });
    this.setState({ currentLabel: `${moment(fromDate).format('L')} – ${moment(toDate).format('L')}`})
  }

  selectRange = (label) => {
    const range = dateRanges.find(r => r.label === label);
    this.props.onChange({ fromDate: range.fromDate(), toDate: range.toDate() });
    this.setState({ currentLabel: range.label });
  }

  render() {
    const { fromDate, toDate } = this.props;
    const [fromMoment, toMoment] = [fromDate, toDate].map(d => moment(d));
    const { currentLabel } = this.state;

    const dateRangePopover = (
      <Popover id="DateRangeSelection-popover">
        <div className="DateRangeSelection-dateSelection">
          <FormGroup controlId="DateRangeSelection-fromDate">
            <ControlLabel>From</ControlLabel>
            <DatePicker
              selected={fromMoment}
              startDate={fromMoment}
              endDate={toMoment}
              selectsStart
              onChange={this.handleDateChange('fromDate')}
              id="DateRangeSelection-fromDate"
            />
          </FormGroup>
          <FormGroup controlId="DateRangeSelection-toDate">
            <ControlLabel>To</ControlLabel>
            <DatePicker
              selected={toMoment}
              startDate={fromMoment}
              endDate={toMoment}
              selectsStart
              onChange={this.handleDateChange('toDate')}
              id="DateRangeSelection-toDate"
            />
          </FormGroup>
        </div>
        <ToggleButtonGroup
          bsSize="small"
          type="radio"
          name="DateRangeSelection-intervalButtons"
          value={currentLabel}
          onChange={this.selectRange}
        >
          {dateRanges.map(({ label }) =>
            <ToggleButton key={label} value={label}>{label}</ToggleButton>)}
        </ToggleButtonGroup>
      </Popover>
    );

    return (
      <div>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={dateRangePopover}>
          <Button>{currentLabel}</Button>
        </OverlayTrigger>
      </div>
    );
  }
}
