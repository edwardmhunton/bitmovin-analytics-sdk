import React from 'react';
import ComparisonTableCell from './ComparisonTableCell.js';

export default function TimeCell(props) {
  return (
    <ComparisonTableCell {...props} best="highest">
      {props.value}
    </ComparisonTableCell>
  );
}
