import React from 'react';
import ComparisonTableCell from './ComparisonTableCell.js';

export default function TimeCell(props) {
  return (
    <ComparisonTableCell {...props} best="lowest">
      {(props.value / 1000).toFixed(2)}s
    </ComparisonTableCell>
  );
}
