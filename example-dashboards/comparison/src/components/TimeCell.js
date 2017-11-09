import React from 'react';
import './TimeCell.css';

const text = (value, isLoading) => {
  if (isLoading) {
    return '⋯';
  }
  if (value) {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return 'N/A';
}

export default function TimeCell({ value, loading, allValues }) {
  const [lowest, ...remaining] = [...allValues].sort((a, b) => a - b);
  const [highest,] = remaining.reverse();

  let className = '';
  if (value === lowest) {
    className = 'best';
  }
  if (value === highest) {
    className = 'worst';
  }

  return (
    <td className={`TimeCell ${className}`}>
      {text(value, loading)}
    </td>
  );
}
