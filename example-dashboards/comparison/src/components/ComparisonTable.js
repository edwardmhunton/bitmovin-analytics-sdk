import React, { Component } from 'react';
import { Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import countryList from 'country-list';
import ComparableSelect, { initialComparableKey, getSingleName } from './ComparableSelect.js';
import AddColumnButton from './AddColumnButton.js';
import ComparisonTableBody from './ComparisonTableBody.js';
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

  fetchPlayers = async () => {
    const { rows } = await this.props.queryBuilder
      .count('STARTUPTIME')
      .licenseKey(this.props.licenseKey)
      .between(this.props.fromDate, this.props.toDate)
      .groupBy('PLAYER')
      .query();
    return rows.map(row => row[0]);
  }

  initialColumnKeys = async (comparableKey) => {
    switch (comparableKey) {
      case 'COUNTRY':
        return ['US', 'AT', 'DE'];
      case 'PLAYER':
        const players = await this.fetchPlayers();
        return players.slice(-3);
      default:
        return [];
    }
  }

  columnName = (columnKey) => {
    switch (this.state.currentComparableKey) {
      case 'COUNTRY':
        return countries.getName(columnKey);
      default:
        return columnKey;
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
    switch (this.state.currentComparableKey) {
      case 'COUNTRY':
        const availableCountries = countries.getData();
        return availableCountries.map(({ code, name }) => ({ key: code, name }));
      case 'PLAYER':
        const players = await this.fetchPlayers();
        return players.map(name => ({ key: name, name }));
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

    const removeTooltip = (
      <Tooltip id="tooltip">Remove this {comparableName}.</Tooltip>
    );

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
                  <OverlayTrigger placement="top" overlay={removeTooltip}>
                    <Button bsSize="xsmall" className="remove" onClick={this.removeColumn(columnKey)}>–</Button>
                  </OverlayTrigger>
                  {this.columnName(columnKey)}
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
          <ComparisonTableBody
            selectedColumnKeys={selectedColumnKeys}
            comparableKey={currentComparableKey}
            fromDate={fromDate}
            toDate={toDate}
            licenseKey={licenseKey}
            queryBuilder={queryBuilder}
            filters={filters}
          />
        </Table>
      </div>
    );
  }
}
