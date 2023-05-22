/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Form } from 'react-bootstrap';
import { IDisabledComponent } from '../interfaces/IDisabledComponent';

function SlippageOption({ disabled }: IDisabledComponent): React.JSX.Element {
  return (
    <Form.Check
      defaultChecked
      className="slippage"
      type="switch"
      id="custom-switch"
      label="Use maximum slippage (recommended)"
      disabled={disabled}
    />
  );
}

export default SlippageOption;
