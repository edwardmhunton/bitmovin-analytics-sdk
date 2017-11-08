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
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
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
              {this.props.countries.getData().map(({ code, name }) =>
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
