import React, { Component } from 'react';
import { Button, FormGroup, FormControl, Modal } from 'react-bootstrap';

export default class AddColumnModal extends Component {
  state = {
    columnKey: '',
    options: [],
  }

  constructor(props) {
    super(props);
    this.awaitOptions(props.optionsPromise);
  }

  componentWillReceiveProps(props) {
    this.awaitOptions(props.optionsPromise);
  }

  awaitOptions = async (optionsPromise) => {
    const options = await optionsPromise;
    const columnKey = options.length > 0 ? options[0].key : '';
    this.setState({ options, columnKey });
  }

  onChange = (event) => {
    this.setState({ columnKey: event.currentTarget.value });
  }

  handleSubmit = () => {
    this.props.onAdd(this.state.columnKey);
    this.props.onHide();
    this.setState({ columnKey: '' });
  }

  render() {
    const { show, onHide, comparableName } = this.props;
    const { options } = this.state;

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add a {comparableName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup controlId="addColunmSelect">
            <FormControl
              componentClass="select"
              placeholder={comparableName}
              value={this.state.columnKey}
              onChange={this.onChange}
            >
              {options.map(({ key, name }) =>
                <option value={key} key={key}>{name}</option>
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
