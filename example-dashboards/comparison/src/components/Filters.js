import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Filter from './Filter.js'
import './Filters.css';

export default function Filters ({ onAdd, onUpdate, filters, queryBuilder, licenseKey, fromDate, toDate }) {
  const updateFilter = (name) => (value) => onUpdate({ name, value });

  return (
    <div className="Filters">
      <h2>Filters</h2>
      <div className="Filters-list">
        <DropdownButton title={'Add a filter'} onSelect={onAdd} id="addFilter">
          <MenuItem eventKey="CDN_PROVIDER">CDN Provider</MenuItem>
          <MenuItem eventKey="BROWSER">Browser</MenuItem>
          <MenuItem eventKey="COUNTRY">Country</MenuItem>
          <MenuItem eventKey="PLAYER">Player</MenuItem>
        </DropdownButton>
        {filters.map(filter =>
          <Filter {...filter}
            key={filter.name}
            queryBuilder={queryBuilder}
            licenseKey={licenseKey}
            fromDate={fromDate}
            toDate={toDate}
            onChange={updateFilter(filter.name)}
          />
        )}
      </div>
    </div>
  );
}
