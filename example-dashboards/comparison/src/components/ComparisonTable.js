import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import countryList from 'country-list';
import ComparableSelect, { initialComparableKey, getSingleName } from './ComparableSelect.js';
import RemoveButton from './RemoveButton.js';
import AddColumnButton from './AddColumnButton.js';
import ComparisonTableBody from './ComparisonTableBody.js';
import { attributeValue } from './lib/attributes.js';
import queryGroups from './lib/queries.js';
import './ComparisonTable.css';

const countries = countryList();

export default class ComparisonTable extends Component {
  constructor() {
    super();
    this.state = {
      selectedColumnKeys: [],
      currentComparableKey: initialComparableKey,
      players: [],
      isLoading: true,
    };
    this.setInitialColumnKeys();
  }

  setInitialColumnKeys = async () => {
    const selectedColumnKeys = await this.initialColumnKeys(this.state.currentComparableKey)
    this.setState({ selectedColumnKeys, isLoading: false });
  }

  fetchAttributeValues = async (attribute) => {
    const { rows } = await this.props.queryBuilder
      .count('STARTUPTIME')
      .licenseKey(this.props.licenseKey)
      .between(this.props.fromDate, this.props.toDate)
      .groupBy(attribute)
      .query();
    return rows.map(row => row[0]);
  }

  initialColumnKeys = async (comparableKey) => {
    switch (comparableKey) {
      case 'COUNTRY':
        return ['US', 'AT', 'DE'];
      case 'PLAYER':
      case 'BROWSER':
      case 'EXPERIMENT_NAME':
        const values = await this.fetchAttributeValues(comparableKey);
        return values.filter(v => v !== null).slice(-3);
      default:
        return [];
    }
  }

  addColumn = (key) => {
    const selectedColumnKeys = [...this.state.selectedColumnKeys, key];
    this.setState({ selectedColumnKeys });
  }

  handleComparableKeyChange = async (currentComparableKey) => {
    this.setState({ isLoading: true });
    const selectedColumnKeys = await this.initialColumnKeys(currentComparableKey)
    this.setState({ currentComparableKey, selectedColumnKeys, isLoading: false });
  }

  removeColumn = (columnKey) => () => {
    const selectedColumnKeys = this.state.selectedColumnKeys.filter(c => c !== columnKey);
    this.setState({ selectedColumnKeys });
  }

  addColumnOptions = async () => {
    const { currentComparableKey } = this.state;

    switch (currentComparableKey) {
      case 'COUNTRY':
        const availableCountries = countries.getData();
        return availableCountries.map(({ code, name }) => ({ key: code, name }));
      case 'PLAYER':
      case 'BROWSER':
      case 'EXPERIMENT_NAME':
        const values = await this.fetchAttributeValues(currentComparableKey);
        return values.map(name => ({ key: name, name }));
      default:
        return [];
    }
  }

  availableAddColumnOptions = async () => {
    const { selectedColumnKeys } = this.state;
    const options = await this.addColumnOptions();
    return options.filter(o => !selectedColumnKeys.includes(o.key));
  }

  render() {
    const { fromDate, toDate, licenseKey, queryBuilder, filters } = this.props;
    const { selectedColumnKeys, currentComparableKey, isLoading } = this.state;
    const comparableName = getSingleName(currentComparableKey);

    return (
      <div className="ComparisonTable">
        <Table className={isLoading && 'isLoading'}>
          <thead>
            <tr>
              <th>
                <ComparableSelect
                  comparableKey={currentComparableKey}
                  onChange={this.handleComparableKeyChange}
                  disabled={isLoading}
                />
              </th>
              {selectedColumnKeys.map((columnKey, index) =>
                <th key={`header-${columnKey}`}>
                  <div className="headerContainer">
                    <RemoveButton
                      id={`${columnKey}ColumnRemoveButton`}
                      tooltip={`Remove this ${comparableName}.`}
                      onClick={this.removeColumn(columnKey)}
                    />
                    {attributeValue(currentComparableKey, columnKey)}
                  </div>
                </th>
              )}
              <th>
                <AddColumnButton
                  comparableName={comparableName}
                  onAdd={this.addColumn}
                  disabled={isLoading}
                  optionsPromise={this.availableAddColumnOptions()}
                />
              </th>
            </tr>
          </thead>
          {queryGroups.map(({ label, queries }) =>
            <ComparisonTableBody
              key={label}
              selectedColumnKeys={selectedColumnKeys}
              comparableKey={currentComparableKey}
              fromDate={fromDate}
              toDate={toDate}
              licenseKey={licenseKey}
              queryBuilder={queryBuilder}
              queries={queries}
              groupLabel={label}
              filters={filters}
            />
          )}
        </Table>
      </div>
    );
  }
}
