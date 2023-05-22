/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { IDisabledComponent } from '../interfaces/IDisabledComponent';

function BuyViaSelect({ disabled }: IDisabledComponent): React.JSX.Element {
  const buyingTokens = [
    { id: 'bnb', currency: 'BNB', contract: '' },
    { id: 'busd', currency: 'BUSD', contract: '' },
  ];

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
            Buy with
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {buyingTokens.map((token) => (
              <Dropdown.Item href="#/action-1">{token.currency}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default BuyViaSelect;
