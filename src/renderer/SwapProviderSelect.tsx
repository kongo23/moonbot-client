/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { IDisabledComponent } from '../interfaces/IDisabledComponent';

function SwapProviderSelect({
  disabled,
}: IDisabledComponent): React.JSX.Element {
  const exchangeProvider = [{ platform: 'PancakeSwap' }];

  return (
    <div className="d-flex justify-content-end">
      <Dropdown>
        <Dropdown.Toggle
          className="main-button"
          variant="primary"
          id="dropdown-basic"
          disabled={disabled}
        >
          PancakeSwap
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {exchangeProvider.map((provider) => (
            <Dropdown.Item href="#/action-1">{provider.platform}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default SwapProviderSelect;
