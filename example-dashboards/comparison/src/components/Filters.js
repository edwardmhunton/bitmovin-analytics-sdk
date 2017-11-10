import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Filter from './Filter.js'
import './Filters.css';

const filterItems = [
  { name: 'CDN_PROVIDER', label: 'CDN Provider' },
  { name: 'BROWSER', label: 'Browser' },
  { name: 'COUNTRY', label: 'Country' },
  { name: 'PLAYER', label: 'Player' },
];

export default function Filters ({ onAdd, onUpdate, filters, queryBuilder, licenseKey, fromDate, toDate }) {
  const updateFilter = (name) => (value) => onUpdate({ name, value });
  const existingFilterNames = filters.map(f => f.name);
  const unusedFilterItems = filterItems.filter(i => !existingFilterNames.includes(i.name));
  const noMoreFilters = unusedFilterItems.length === 0;

  return (
    <div className="Filters">
      <h2>Filters</h2>
      <div className="Filters-list">
        <DropdownButton title={'Add a filter'} onSelect={onAdd} id="addFilter" disabled={noMoreFilters}>
          {unusedFilterItems.map(({ name, label }) =>
            <MenuItem key={name} eventKey={name}>{label}</MenuItem>)}
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
