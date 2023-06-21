/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Dropdown } from 'react-bootstrap';

interface IProviderSelectProps {
  disabled: boolean;
  availableData: Array<{ id: string; value: string; icon: string }>;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
}

function SwapProviderSelect({
  disabled,
  availableData,
  handleInputChange,
}: IProviderSelectProps): React.JSX.Element {
  function handleSlection(selectedPlatform: string): void {
    handleInputChange('provider', selectedPlatform);
  }

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="main-button-top"
        variant="primary"
        id="dropdown-basic"
        disabled={disabled}
      >
        {availableData[0].value} <i className={availableData[0].icon} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {availableData.map((data) => (
          <Dropdown.Item key={data.id} onClick={() => handleSlection(data.id)}>
            {data.value} <i className={data.icon} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SwapProviderSelect;
