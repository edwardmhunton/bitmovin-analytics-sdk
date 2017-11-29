import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default function VideoSelect({ currentVideoId, handleVideoIdChange, videoIds, disabled }) {
  const videoIdOptions = [
    { key: '', value: 'All' },
    ...videoIds.map(id => ({ key: id, value: id }))
  ]

  return (
    <FormGroup controlId="videoIdSelectGroup">
      <ControlLabel>Video</ControlLabel>
      <FormControl
        componentClass="select"
        placeholder="select"
        value={currentVideoId}
        onChange={handleVideoIdChange}
        disabled={disabled}
      >
        {videoIdOptions.map(({ key, value }) =>
          <option value={key} key={key}>
            {value}
          </option>)}
      </FormControl>
    </FormGroup>
  )
}
