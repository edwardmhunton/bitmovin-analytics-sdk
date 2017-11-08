import React from 'react';
import CountryCell from './CountryCell.js';

const dimensions = ['STARTUPTIME', 'PLAYER_STARTUPTIME', 'VIDEO_STARTUPTIME'];
const aggregations = [{ name: 'median' }, { name: 'percentile', param: 95 }]
const queries = dimensions
  .map(dimension => aggregations.map(({ name, param }) => ({
    dimension,
    aggregation: name,
    aggregationParam: param,
  })))
  .reduce((totalArray, dimArray) => [...totalArray, ...dimArray], []); // flatten

const dimensionNames = {
  STARTUPTIME: 'Total Startup Time',
  PLAYER_STARTUPTIME: 'Player Startup Time',
  VIDEO_STARTUPTIME: 'Video Startup Time',
}
const aggregationName = ({ aggregation, aggregationParam }) => {
  switch (aggregation) {
    case 'percentile':
      return `${aggregationParam}th percentile`;
    default:
      return aggregation;
  }
}
const nameForQuery = (query) => {
  return `${dimensionNames[query.dimension]} (${aggregationName(query)})`;
}

export default function ComparisonTableBody(props) {
  const { selectedCountries, fromDate, toDate, licenseKey, queryBuilder } = props;

  return (
    <tbody>
      {queries.map(q =>
        <tr key={`${q.country}-${q.dimension}-${q.aggregation}-${q.aggregationParam}`}>
          <td>{nameForQuery(q)}</td>
          {selectedCountries.map(country =>
            <CountryCell
              {...q}
              key={country}
              country={country}
              fromDate={fromDate}
              toDate={toDate}
              licenseKey={licenseKey}
              queryBuilder={queryBuilder}
            />
          )}
          <td/>
        </tr>
      )}
    </tbody>
  )
}
