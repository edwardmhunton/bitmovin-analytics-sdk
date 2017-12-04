import React from 'react';
import { Table } from 'react-bootstrap';
import errors from '../errors.js';
import './ErrorTable.css';

const errorMapping = errors
  .reduce((errorMap, { errorCode, errorMessage }) => ({ ...errorMap, [errorCode]: errorMessage }));

export default function ErrorTable({ selectedTimestamp, selectedSeriesName, onSelectSeriesName, data }) {
  if (!selectedTimestamp) {
    return '';
  }

  const selectedDate = new Date(selectedTimestamp);
  const formattedTime = [selectedDate.getHours(), selectedDate.getMinutes()]
    .map(num => `0${num}`.slice(-2)) // padding 0
    .join(':');

  const errorRows = data
    .filter(([timestamp,]) => timestamp === selectedTimestamp)
    .sort((a, b) =>  b[2] - a[2] || a[1] - b[1]); // desc by occurrence, then acs by error code

  return (
    <div className="ErrorTable">
      <h2>Errors at {formattedTime}</h2>
      <Table striped condensed hover>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {errorRows.map(([, errorCode, occurrences]) =>
            <tr
              key={errorCode}
              className={`${errorCode}` === selectedSeriesName ? 'highlighted' : null}
              onClick={() => onSelectSeriesName(`${errorCode}`)}
            >
              <td>{errorCode}</td>
              <td>{errorMapping[errorCode]}</td>
              <td>{occurrences}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
