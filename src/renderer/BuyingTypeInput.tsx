/* eslint-disable react/jsx-no-bind */
import React, { useState, ChangeEvent } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { IDisabledComponent } from '../interfaces/IDisabledComponent';

function BuyingTypeInput({ disabled }: IDisabledComponent): React.JSX.Element {
  const [buyMaxAmount, setBuyMaxAmount] = useState(true);

  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    setBuyMaxAmount(event.target.id === 'max-amount');
  }

  return (
    <div>
      <div>
        <Form.Check
          inline
          label="Buy max amount of tokens"
          name="group1"
          type="radio"
          id="max-amount"
          checked={buyMaxAmount}
          onChange={handleRadioChange}
          disabled={disabled}
        />
        <Form.Check
          inline
          label="Buy explicit number of tokens"
          name="group1"
          type="radio"
          id="explicit-amount"
          checked={!buyMaxAmount}
          onChange={handleRadioChange}
          disabled={disabled}
        />
      </div>
      <div>
        {buyMaxAmount ? (
          <InputGroup className="mb-2 d-flex amount-input">
            <div className="input-group-prepend">
              <span className="input-group-text input-icon">
                <i className="bi bi-currency-dollar" />
              </span>
            </div>
            <Form.Control
              placeholder="Amount to spend e.g (0.5, 1, 10, 10000 etc.)"
              disabled={disabled}
            />
          </InputGroup>
        ) : (
          <InputGroup className="mb-2 d-flex amount-input">
            <div className="input-group-prepend">
              <span className="input-group-text input-icon">
                <i className="bi bi-cash-coin" />
              </span>
            </div>
            <Form.Control
              placeholder="Number of tokens to buy e.g (0.5, 1, 10, 10000 etc.)"
              disabled={disabled}
            />
          </InputGroup>
        )}
        <InputGroup className="mb-2 d-flex amount-input">
          <div className="input-group-prepend">
            <span className="input-group-text input-icon">
              <i className="bi bi-cash-coin" />
            </span>
          </div>
          <Form.Control
            placeholder="Max Spending Limit (transaction will fail if exceeds)"
            disabled={disabled}
          />
        </InputGroup>
      </div>
    </div>
  );
}

export default BuyingTypeInput;
