/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dropdown, Form, InputGroup } from 'react-bootstrap';

interface IProviderSelectProps {
  disabled: boolean;
  availableData: Array<{ id: string; value: string; icon: string }>;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (id: string, value: string) => void;
  id: string;
}

function SwapProviderSelect({
  disabled,
  availableData,
  handleInputChange,
  id,
}: IProviderSelectProps): React.JSX.Element {
  const [currentValue, setCurrentValue] = useState(availableData[0].value);
  const [inputActive, setInputActive] = useState(false);
  const otherInputEl = useRef<HTMLInputElement | null>(null);

  const handleSlection = useCallback(
    (selectedPlatform: string) => {
      handleInputChange(id, selectedPlatform);
    },
    [handleInputChange, id]
  );

  const setValue = (value: string) => {
    setCurrentValue(value);
    handleSlection(value);
  };

  const inputOnBlur = useCallback(
    (e: any) => {
      if (!e.target.value) {
        setInputActive(false);
        setCurrentValue(availableData[0].value);
        handleSlection(availableData[0].value);
      }
    },
    [availableData, handleSlection]
  );

  useEffect(() => {
    const lastIndex = availableData.length - 1;
    if (
      currentValue === availableData[lastIndex].value &&
      availableData[lastIndex].id === 'custom'
    ) {
      setInputActive(true);
      setTimeout(() => {
        otherInputEl.current?.focus();
      });
    } else if (currentValue === '') {
      setInputActive(false);
    }
  }, [availableData, currentValue]);

  return (
    <div>
      {inputActive ? (
        <InputGroup className="d-flex node-input">
          <div className="input-group-prepend">
            <span className="input-group-text input-icon">
              <i className="bi bi-database" />
            </span>
          </div>
          <Form.Control
            ref={otherInputEl}
            onBlur={inputOnBlur}
            placeholder="wss://"
            onChange={(e) => setValue(e.target.value)}
          />
        </InputGroup>
      ) : (
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
              <Dropdown.Item key={data.id} onClick={() => setValue(data.value)}>
                {data.value} <i className={data.icon} />
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export default SwapProviderSelect;
