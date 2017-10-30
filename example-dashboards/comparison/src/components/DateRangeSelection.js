import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import moment from 'moment';

const dateRanges = Object.freeze([
  Object.freeze({
    label: 'Last 7 days',
    fromDate: () => moment().subtract(7, 'days').toDate(),
    toDate: () => new Date(),
  }),
  Object.freeze({
    label: 'This month',
    fromDate: () => moment().startOf('month').toDate(),
    toDate: () => moment().endOf('month').toDate(),
  }),
  Object.freeze({
    label: 'This year',
    fromDate: () => moment().startOf('year').toDate(),
    toDate: () => moment().endOf('year').toDate(),
  }),
]);

export const initialDateRange = dateRanges[0];

export default class DateRangeSelection extends Component {
  state = {
    label: initialDateRange.label,
    popoverIsOpen: false,
    popoverAnchorEl: null,
  }

  handleDateChange = (attr) => (event, date) => {
    const { fromDate, toDate, onChange } = this.props;
    const update = { [attr]: date };
    onChange({ fromDate, toDate, ...update });
    this.setState({ label: `${moment(fromDate).format('L')} – ${moment(toDate).format('L')}`})
  }

  togglePopover = (event) => {
    event.preventDefault();
    const { popoverIsOpen } = this.state;
    this.setState({ popoverIsOpen: !popoverIsOpen, popoverAnchorEl: event.currentTarget });
  }

  closePopover = () => this.setState({ popoverIsOpen: false });

  selectRange = (label) => () => {
    const range = dateRanges.find(r => r.label === label);
    this.props.onChange({ fromDate: range.fromDate(), toDate: range.toDate() });
    this.setState({ label: range.label });
  }

  render() {
    const { fromDate, toDate } = this.props;
    const { label } = this.state;

    return (
      <div>
        <FlatButton label={label} labelPosition="before" icon={<ArrowDown />} onClick={this.togglePopover} />
        <Popover
          open={this.state.popoverIsOpen}
          anchorEl={this.state.popoverAnchorEl}
          onRequestClose={this.closePopover}
          style={{ width: '40rem' }}
        >
          <div style={{ padding: '0.5rem 1rem' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'nowrap',
              justifyContent: 'space-between',
            }}>
              <DatePicker
                floatingLabelText="from"
                value={fromDate}
                onChange={this.handleDateChange('fromDate')}
                autoOk
                container="inline"
              />
              <DatePicker
                floatingLabelText="to"
                value={toDate}
                onChange={this.handleDateChange('toDate')}
                autoOk
                container="inline"
              />
            </div>
            <div>
              {dateRanges.map(({ label }) =>
                <FlatButton label={label} key={label} onClick={this.selectRange(label)} />)}
            </div>
          </div>
        </Popover>
      </div>
    );
  }
}
