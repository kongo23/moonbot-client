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
      placeholder: 'Your wallet private key',
      iconclass: 'bi-wallet',
      type: 'password',
      id: 'password',
    },
    {
      placeholder: 'Your wallet address',
      iconclass: 'bi-wallet',
      id: 'walletAddress',
    },
    {
      placeholder: 'Token contract to buy',
      iconclass: 'bi-cash-stack',
      id: 'tokenToBuy',
    },
  ];

  return (
    <div>
      {inputsGeneralData.map((inputData) => (
        <InputGroup className="mb-2">
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
