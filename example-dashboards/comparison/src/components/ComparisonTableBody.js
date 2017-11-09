import React from 'react';
import TimeRow from './TimeRow.js';
import './ComparisonTableBody.css';

const dimensions = ['STARTUPTIME', 'PLAYER_STARTUPTIME', 'VIDEO_STARTUPTIME'];
const aggregations = [{ name: 'median' }, { name: 'percentile', param: 95 }]
const queries = dimensions
  .map(dimension => aggregations.map(({ name, param }) => ({
    dimension,
    aggregation: name,
    aggregationParam: param,
  })))
  .reduce((totalArray, dimArray) => [...totalArray, ...dimArray], []); // flatten

export default function ComparisonTableBody(props) {
  const { selectedColumnKeys, fromDate, toDate, licenseKey, queryBuilder, comparableKey } = props;

  return (
    <tbody className="ComparisonTableBody">
      {queries.map(q =>
        <TimeRow
          key={`${q.columnKey}-${q.dimension}-${q.aggregation}-${q.aggregationParam}`}
          query={{ ...q, fromDate, toDate, licenseKey, comparableKey }}
          columnKeys={selectedColumnKeys}
          queryBuilder={queryBuilder}
        />
      )}
    </tbody>
  )
}
