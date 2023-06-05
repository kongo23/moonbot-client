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
    { id: 'bnb', currency: 'BNB', contract: '' },
    { id: 'busd', currency: 'BUSD', contract: '' },
  ];

  function handleSlection(currency: string): void {
    setSelectedToken(currency);
    handleInputChange('buyVia', currency);
  }

  return (
    <div className="d-flex">
      <div className="form-group input-group d-flex available-items-list">
        <Dropdown>
          <Dropdown.Toggle
            className="main-button"
            variant="primary"
            id="dropdown-basic"
            disabled={disabled}
          >
            {selectedToken || 'Buy with'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {buyingTokens.map((token) => (
              <Dropdown.Item
                key={token.currency}
                onClick={() => handleSlection(token.currency)}
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
