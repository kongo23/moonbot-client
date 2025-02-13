/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface IDefaultInfoInput {
  disabled: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
}

function DefaultInfoInput({
  disabled,
  handleInputChange,
}: IDefaultInfoInput): React.JSX.Element {
  const inputsGeneralData = [
    {
      placeholder: 'Your wallet address',
      iconclass: 'bi-wallet',
      id: 'walletAddress',
    },
    {
      placeholder: 'Your wallet private key',
      iconclass: 'bi-key',
      type: 'password',
      id: 'walletKey',
    },
    {
      placeholder: 'Token contract to buy',
      iconclass: 'bi-123',
      id: 'tokenToBuy',
    },
  ];

  return (
    <div>
      {inputsGeneralData.map((inputData) => (
        <InputGroup key={inputData.id} className="mb-2">
          <div className="input-group-prepend">
            <span className="input-group-text input-icon">
              {' '}
              <i className={`bi ${inputData.iconclass}`} />
            </span>
          </div>
          <Form.Control
            placeholder={inputData.placeholder}
            type={inputData.type}
            disabled={disabled}
            onChange={(e) => handleInputChange(inputData.id, e.target.value)}
          />
        </InputGroup>
      ))}
    </div>
  );
}

export default DefaultInfoInput;
