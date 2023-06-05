/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import Button from 'react-bootstrap/Button';

// import InputGroup from 'react-bootstrap/InputGroup';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import DefaultInfoInput from './DefaultInfoInput';
import BuyingTypeInput from './BuyingTypeInput';
import LogContainer from './LogContainer';
import BuyViaSelect from './BuyViaSelect';
import SwapProviderSelect from './SwapProviderSelect';
import SlippageOption from './SlippageOption';

function ConfigurationForm() {
  const [showLogs, setShowLogs] = useState(false);
  const [inputData, setInputData] = useState({
    walletAddress: '',
    password: '',
    tokenToBuy: '',
    provider: 'PancakeSwap',
    buyVia: '',
    amountToSpend: '',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '',
    usingMaxSlippage: 'true',
  });

  const handleInputChange = (inputName: string, value: string) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [inputName]: value,
    }));
  };

  const handleStartButton = () => {
    setShowLogs(true);
    // eslint-disable-next-line no-console
    console.log('Input Data:', inputData);
  };

  return (
    <div className="container">
      <form className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1>
              MoonBot <i className="bi bi-moon" />
            </h1>
          </div>
          <SwapProviderSelect
            disabled={showLogs}
            handleInputChange={handleInputChange}
          />
        </div>

        <DefaultInfoInput
          disabled={showLogs}
          handleInputChange={handleInputChange}
        />

        <BuyingTypeInput
          disabled={showLogs}
          handleInputChange={handleInputChange}
        />

        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <BuyViaSelect
              disabled={showLogs}
              handleInputChange={handleInputChange}
            />
          </div>
          <div className="d-flex justify-content-end">
            <SlippageOption
              disabled={showLogs}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>

        <Button
          className="start-button"
          variant="primary"
          onClick={() => handleStartButton()}
          disabled={showLogs}
        >
          Start Bot <i className="bi bi-rocket-takeoff" />
        </Button>
      </form>
      {/* ******************* LOGS ******************* */}
      <LogContainer
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        buyingToken={inputData.buyVia}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConfigurationForm />} />
      </Routes>
    </Router>
  );
}
