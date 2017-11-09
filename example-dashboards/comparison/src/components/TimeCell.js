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
  if (loading) {
    return '';
  }

  const [lowest, ...remaining] = [...allValues].sort((a, b) => a - b);
  const [highest,] = remaining.reverse();

  switch (value) {
    case lowest:
      return 'best';
    case highest:
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
