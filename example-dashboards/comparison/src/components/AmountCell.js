import React from 'react';
import TableCell from './TableCell.js';

export default function TimeCell(props) {
  return (
    <TableCell {...props} best="highest">
      {props.value}
    </TableCell>
  );
}
