import React from 'react';

const text = (value, isLoading) => {
  if (isLoading) {
    return '⋯';
  }
  if (value) {
    return `${(value / 1000).toFixed(2)}s`;
  }
  return 'N/A';
}

export default function TimeCell({ value, loading }) {
  return (
    <td>
      {text(value, loading)}
    </td>
  );
}
