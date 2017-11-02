import React, { Component } from 'react';
import { FormGroup, FormControl, Table } from 'react-bootstrap';
import countryList from 'country-list';
import Bitmovin from 'bitmovin-javascript';
import CountryCell from './CountryCell.js';

const countries = countryList();

export default class ComparisonTable extends Component {
  constructor({ apiKey, licenseKey, fromDate, toDate }) {
    super();
    console.log(apiKey);
    const bitmovin = new Bitmovin({ apiKey });
    this.state = {
      queryBuilder: bitmovin.analytics.queries.builder,
      selectedCountries: ['US', 'AT', 'DE'],
    };
  }

  changeCountryCode = (index) => (event) => {
    const selectedCountries = [...this.state.selectedCountries];
    selectedCountries[index] = event.currentTarget.value;
    this.setState({ selectedCountries });
  }

  render() {
    const { fromDate, toDate, licenseKey } = this.props;
    const { selectedCountries, queryBuilder } = this.state;

    return (
      <Table>
        <thead>
          <tr>
            <th></th>
            {selectedCountries.map((countryCode, index) =>
              <th key={`header-${countryCode}`}>
                <FormGroup controlId={`countrySelect${index}`}>
                  <FormControl
                    componentClass="select"
                    placeholder="country"
                    value={countryCode}
                    onChange={this.changeCountryCode(index)}
                  >
                    {countries.getData().map(({ code, name }) =>
                      <option value={code} key={code}>{name}</option>
                    )}
                  </FormControl>
                </FormGroup>
              </th>
            )}
            <th>+</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Startup Time (median)</td>
            {selectedCountries.map(country =>
              <CountryCell
                key={`${country}-STARTUPTIME-median`}
                country={country}
                fromDate={fromDate}
                toDate={toDate}
                licenseKey={licenseKey}
                aggregation="median"
                dimension="STARTUPTIME"
                queryBuilder={queryBuilder}
              />
            )}
          </tr>
        </tbody>
      </Table>
    );
  }
}
