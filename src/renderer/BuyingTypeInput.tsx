/* eslint-disable react/jsx-no-bind */
import React, { useState, ChangeEvent } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

interface IBuyingTypeInputProps {
  disabled: boolean;
  selectedCurrency: string;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
}

function BuyingTypeInput({
  disabled,
  selectedCurrency,
  handleInputChange,
}: IBuyingTypeInputProps): React.JSX.Element {
  const [buyMaxAmount, setBuyMaxAmount] = useState(true);
  const [amountToSpendValue, setAmountToSpendInputValue] = useState('');
  const [numberOfTokensToBuyValue, setNumberOfTokensToBuyInputValue] =
    useState('');

  function handleTypeOfHowToBuyTokens(
    amountToSpendParam: string,
    numberOfTokensToBuyParam: string
  ) {
    handleInputChange('amountToSpend', amountToSpendParam);
    handleInputChange('numberOfTokensToBuy', numberOfTokensToBuyParam);
    // managing values cleaning up for switch visualization
    setAmountToSpendInputValue(amountToSpendParam);
    setNumberOfTokensToBuyInputValue(numberOfTokensToBuyParam);
  }

  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    setBuyMaxAmount(event.target.id === 'max-amount');
    // cleanup
    handleTypeOfHowToBuyTokens('', '');
    handleInputChange('maxSpendingLimit', '');
  }

  return (
    <div className="buying-settings-block">
      <div className="d-flex justify-content-between buying-settings-block-options">
        <Form.Check
          label="Buy maximum tokens"
          name="group1"
          type="radio"
          id="max-amount"
          checked={buyMaxAmount}
          onChange={handleRadioChange}
          disabled={disabled}
        />
        <Form.Check
          label="Buy exact number of tokens"
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
                <i className="bi bi-cash" />
              </span>
            </div>
            <Form.Control
              placeholder={
                selectedCurrency
                  ? `Amount to spend in ${selectedCurrency} e.g (0.5, 1, 10 etc.)`
                  : `Please select a buying token`
              }
              disabled={disabled}
              onChange={(e) => handleTypeOfHowToBuyTokens(e.target.value, '')}
              value={amountToSpendValue}
            />
          </InputGroup>
        ) : (
          <>
            <InputGroup className="mb-2 d-flex amount-input">
              <div className="input-group-prepend">
                <span className="input-group-text input-icon">
                  <i className="bi bi-files" />
                </span>
              </div>
              <Form.Control
                placeholder="Number of tokens to buy e.g (0.5, 1, 10 etc.)"
                disabled={disabled}
                onChange={(e) => handleTypeOfHowToBuyTokens('', e.target.value)}
                value={numberOfTokensToBuyValue}
              />
            </InputGroup>
            <InputGroup className="mb-2 d-flex amount-input">
              <div className="input-group-prepend">
                <span className="input-group-text input-icon">
                  <i className="bi bi-cash-coin" />
                </span>
              </div>
              <Form.Control
                placeholder={`Spending limit in ${selectedCurrency} e.g (0.5, 1, 10 etc.)`}
                disabled={disabled}
                onChange={(e) =>
                  handleInputChange('maxSpendingLimit', e.target.value)
                }
              />
            </InputGroup>
          </>
        )}
      </div>
    </div>
  );
}

export default BuyingTypeInput;
