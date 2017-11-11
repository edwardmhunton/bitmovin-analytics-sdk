import React, { Component } from 'react';
import Bitmovin from 'bitmovin-javascript';
import { Panel } from 'react-bootstrap';
import DateRangeSelection, { initialDateRange } from './DateRangeSelection.js';
import ComparisonTable from './ComparisonTable.js';
import LicenseKeySelect from './LicenseKeySelect.js';
import Filters from './Filters.js';
import './Main.css';

export default class Main extends Component {

  state = {
    fromDate: initialDateRange.fromDate(),
    toDate: initialDateRange.toDate(),
    filters: [],
    queryBuilder: new Bitmovin({ apiKey: this.props.apiKey }).analytics.queries.builder,
  };

  currentLicenseKey = () => localStorage.getItem('licenseKey') || this.props.licenses[0].licenseKey;

  handleLicenseChange = (event) => {
    localStorage.setItem('licenseKey', event.currentTarget.value)
    this.forceUpdate();
  }

  handleDateRangeChange = ({ fromDate, toDate }) =>
    this.setState({ fromDate, toDate });

  handleFilterAdd = (attribute) => {
    const { filters } = this.state;
    this.setState({ filters: [...filters, { attribute }] });
  }

  handleFilterUpdate = ({ attribute, value }) => {
    const filters = [...this.state.filters];
    const filter = filters.find(f => f.attribute === attribute);
    filter.value = value;
    this.setState({ filters });
  }

  handleFilterRemove = (attribute) => {
    const filters = this.state.filters.filter(f => f.attribute !== attribute);
    this.setState({ filters });
  }

  render() {
    const { licenses } = this.props;
    const { fromDate, toDate, filters, queryBuilder } = this.state;
    const queryFilters = filters
      .filter(({ attribute, value }) => value)
      .map(({ attribute, value }) => [attribute, 'EQ', value]);
    const currentLicenseKey = this.currentLicenseKey();

    return (
      <div className="Main-container">
        {licenses.length > 1 && <LicenseKeySelect
          currentLicenseKey={currentLicenseKey}
          handleLicenseChange={this.handleLicenseChange}
          licenses={licenses}
        />}
        <Panel>
          <form>
            <div className="Main-titleRow">
              <h1>Compare</h1>
              <DateRangeSelection fromDate={fromDate} toDate={toDate} onChange={this.handleDateRangeChange}/>
            </div>
            <Filters
              onAdd={this.handleFilterAdd}
              onUpdate={this.handleFilterUpdate}
              onRemove={this.handleFilterRemove}
              filters={filters}
              queryBuilder={queryBuilder}
              fromDate={fromDate}
              toDate={toDate}
              licenseKey={currentLicenseKey}
            />
            <ComparisonTable
              fromDate={fromDate}
              toDate={toDate}
              licenseKey={currentLicenseKey}
              queryBuilder={queryBuilder}
              filters={queryFilters}
            />
          </form>
        </Panel>
      </div>
    );
  }
}
