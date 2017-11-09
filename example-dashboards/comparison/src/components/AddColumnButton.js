import React, { Component } from 'react';
import {  Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AddColumnModal from './AddColumnModal.js';

export default class AddColumnButton extends Component {
  state = {
    options: [],
    showAddColumnModal: false,
  }

  constructor(props) {
    super(props);
    this.awaitOptions(props.optionsPromise);
  }

  componentWillReceiveProps({ disabled, optionsPromise }) {
    if (!disabled) {
      this.awaitOptions(optionsPromise);
    }
  }

  awaitOptions = async (optionsPromise) => {
    const options = await optionsPromise;
    this.setState({ options });
  }

  handleAddButtonClick = () => {
    this.setState({ showAddColumnModal: true });
  }

  hideAddColumnModal = () => {
    this.setState({ showAddColumnModal: false });
  }

  render() {
    const { comparableName, onAdd, disabled } = this.props;
    const { options, showAddColumnModal } = this.state;
    const noMoreOptions = options.length === 0;

    const addTooltip = (
      <Tooltip id="tooltip">Add another {comparableName}</Tooltip>
    );

    return (
      <div>
        <OverlayTrigger placement="top" overlay={addTooltip} rootClose>
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            disabled={noMoreOptions || disabled}
            onClick={this.handleAddButtonClick}
          >
            +
          </Button>
        </OverlayTrigger>
        <AddColumnModal
          onAdd={onAdd}
          show={showAddColumnModal}
          onHide={this.hideAddColumnModal}
          options={options}
          comparableName={comparableName}
        />
      </div>
    );
  }
}
