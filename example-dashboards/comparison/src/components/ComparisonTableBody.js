import React from 'react';
import TimeRow from './TimeRow.js';
import queries from './lib/queries.js';
import './ComparisonTableBody.css';

export default function ComparisonTableBody(props) {
  const { selectedColumnKeys, fromDate, toDate, licenseKey, queryBuilder, comparableKey } = props;

  return (
    <tbody className="ComparisonTableBody">
      {queries.map(q =>
        <TimeRow
          key={q.label}
          query={{ ...q, fromDate, toDate, licenseKey, comparableKey }}
          columnKeys={selectedColumnKeys}
          queryBuilder={queryBuilder}
        />
      )}
    </tbody>
  )
}
