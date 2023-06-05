/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Form } from 'react-bootstrap';

interface ISlippageOptionProps {
  disabled: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
}

function SlippageOption({
  disabled,
  handleInputChange,
}: ISlippageOptionProps): React.JSX.Element {
  return (
    <Form.Check
      defaultChecked
      className="slippage"
      type="switch"
      id="custom-switch"
      label="Use maximum slippage (recommended)"
      disabled={disabled}
      onChange={(e) =>
        handleInputChange('usingMaxSlippage', e.target.checked.toString())
      }
    />
  );
}

export default SlippageOption;
