import React, { Component } from 'react';
import { Button, FormGroup, FormControl, Modal } from 'react-bootstrap';

export default class AddCountryModal extends Component {
  state = {
    countryCode: '',
  }

  onChange = (event) => {
    this.setState({ countryCode: event.currentTarget.value });
  }

  handleSubmit = () => {
    this.props.onAdd(this.state.countryCode);
    this.props.onHide();
    this.setState({ countryCode: '' });
  }

  render() {
    const { show, onHide, countries } = this.props;

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add a country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="addCountrySelect">
            <FormControl
              componentClass="select"
              placeholder="country"
              value={this.state.countryCode}
              onChange={this.onChange}
            >
              {countries.map(({ code, name }) =>
                <option value={code} key={code}>{name}</option>
              )}
            </FormControl>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.handleSubmit}>Add</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
