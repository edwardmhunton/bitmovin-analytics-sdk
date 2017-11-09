import React, { Component } from 'react';
import { Table, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import countryList from 'country-list';
import Bitmovin from 'bitmovin-javascript';
import ComparableSelect, { initialComparableKey, getSingleName } from './ComparableSelect.js';
import AddColumnModal from './AddColumnModal.js';
import ComparisonTableBody from './ComparisonTableBody.js';
import './ComparisonTable.css';

const countries = countryList();

export default class ComparisonTable extends Component {
  constructor({ apiKey, licenseKey, fromDate, toDate }) {
    super();
    const bitmovin = new Bitmovin({ apiKey });
    this.state = {
      queryBuilder: bitmovin.analytics.queries.builder,
      selectedColumnKeys: [],
      showAddColumnModal: false,
      currentComparableKey: initialComparableKey,
      players: [],
    };
    this.setInitialColumnKeys();
  }

  setInitialColumnKeys = async () => {
    const selectedColumnKeys = await this.initialColumnKeys(this.state.currentComparableKey)
    this.setState({ selectedColumnKeys });
  }

  fetchPlayers = async () => {
    const { rows } = await this.state.queryBuilder
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

  handleAddButtonClick = () => {
    this.setState({ showAddColumnModal: true });
  }

  handleComparableKeyChange = async (currentComparableKey) => {
    const selectedColumnKeys = await this.initialColumnKeys(currentComparableKey)
    this.setState({ currentComparableKey, selectedColumnKeys });
  }

  hideAddColumnModal = () => {
    this.setState({ showAddColumnModal: false });
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
    const options = await this.addColumnOptions();
    return options.filter(o => !this.state.selectedColumnKeys.includes(o.key));
  }

  render() {
    const { fromDate, toDate, licenseKey } = this.props;
    const { selectedColumnKeys, queryBuilder, currentComparableKey } = this.state;
    const comparableName = getSingleName(currentComparableKey);

    const removeTooltip = (
      <Tooltip id="tooltip">Remove this {comparableName}.</Tooltip>
    );

    const addTooltip = (
      <Tooltip id="tooltip">Add another {comparableName}.</Tooltip>
    );

    return (
      <div className="ComparisonTable">
        <Table>
          <thead>
            <tr>
              <th>
                <ComparableSelect
                  comparableKey={currentComparableKey}
                  onChange={this.handleComparableKeyChange}
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
                <OverlayTrigger placement="top" overlay={addTooltip}>
                  <Button bsStyle="primary" bsSize="xsmall" onClick={this.handleAddButtonClick}>+</Button>
                </OverlayTrigger>
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
          />
        </Table>
        <AddColumnModal
          onAdd={this.addColumn}
          show={this.state.showAddColumnModal}
          onHide={this.hideAddColumnModal}
          optionsPromise={this.availableAddColumnOptions()}
          comparableName={comparableName}
        />
      </div>
    );
  }
}
