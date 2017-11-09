import React from 'react';
import './TimeCell.css';

const text = ({ value, loading }) => {
  if (loading) {
    return '⋯';
  }
  if (value) {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return 'N/A';
}

const className = ({ value, loading, allValues }) => {
  if (loading || !value) {
    return '';
  }

  const sortedValues = allValues.filter(v => v !== null).sort((a, b) => a - b);
  const [lowestValue, ...highestValues] = sortedValues;
  const [highestValue,] = highestValues.reverse();

  switch (value) {
    case lowestValue:
      return 'best';
    case highestValue:
      return 'worst';
    default:
      return '';
  }
}

export default function TimeCell(props) {
  return (
    <td className={`TimeCell ${className(props)}`}>
      {text(props)}
    </td>
  );
}
