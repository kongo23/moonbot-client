/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

interface IBuyViaSelectProps {
  disabled: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
}

function BuyViaSelect({
  disabled,
  handleInputChange,
}: IBuyViaSelectProps): React.JSX.Element {
  const [selectedToken, setSelectedToken] = useState('');

  const buyingTokens = [
    {
      id: 'bnb',
      currency: 'BNB',
      contract: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    {
      id: 'busd',
      currency: 'BUSD',
      contract: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    },
  ];

  function handleSlection(currency: string, contract: string): void {
    setSelectedToken(currency);
    handleInputChange('buyingToken', currency);
    handleInputChange('buyingTokenContract', contract);
  }

  return (
    <div className="d-flex">
      <div className="form-group input-group d-flex available-items-list">
        {' '}
        Buy with:
        <Dropdown>
          <Dropdown.Toggle
            className="main-button"
            variant="primary"
            id="dropdown-basic"
            disabled={disabled}
          >
            {selectedToken || 'Select'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {buyingTokens.map((token) => (
              <Dropdown.Item
                key={token.currency}
                onClick={() => handleSlection(token.currency, token.contract)}
                active={selectedToken === token.currency}
              >
                {token.currency}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default BuyViaSelect;
