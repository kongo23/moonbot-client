/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface IProviderSelectProps {
  disabled: boolean;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
}

function SwapProviderSelect({
  disabled,
  handleInputChange,
}: IProviderSelectProps): React.JSX.Element {
  const exchangeProvider = [{ platform: 'PancakeSwap' }];

  function handleSlection(selectedPlatform: string): void {
    handleInputChange('provider', selectedPlatform);
  }

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
            <Dropdown.Item
              key={provider.platform}
              onClick={() => handleSlection(provider.platform)}
            >
              {provider.platform}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default SwapProviderSelect;
