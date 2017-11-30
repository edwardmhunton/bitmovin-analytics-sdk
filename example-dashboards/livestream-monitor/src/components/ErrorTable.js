import React from 'react';
import { Table } from 'react-bootstrap';

export default function ErrorTable(props) {
  console.log(props);
  const { selectedTimestamp, data } = props;

  if (!selectedTimestamp) {
    return '';
  }

  const selectedDate = new Date(selectedTimestamp);
  const formattedTime = [selectedDate.getHours(), selectedDate.getMinutes()]
    .map(num => `0${num}`.slice(-2)) // padding 0
    .join(':');

  const errorRows = data
    .filter(([timestamp,]) => timestamp === selectedTimestamp)
    .sort((a, b) =>  b[2] - a[2]); // desc by occurrence

  return (
    <div>
      <h2>Errors at {formattedTime}</h2>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {errorRows.map(([, errorCode, occurrences]) =>
            <tr key={errorCode}>
              <td>{errorCode}</td>
              <td>TODO</td>
              <td>{occurrences}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}
