/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { IDisabledComponent } from '../interfaces/IDisabledComponent';

function DefaultInfoInput({ disabled }: IDisabledComponent): React.JSX.Element {
  const inputsGeneralData = [
    {
      placeholder: 'Your wallet private key',
      iconclass: 'bi-wallet',
      type: 'password',
    },
    {
      placeholder: 'Your wallet address',
      iconclass: 'bi-wallet',
    },
    {
      placeholder: 'Token contract to buy',
      iconclass: 'bi-cash-stack',
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
          />
        </InputGroup>
      ))}
    </div>
  );
}

export default DefaultInfoInput;
