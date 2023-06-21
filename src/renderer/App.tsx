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

import { ICustomerInputData } from '../interfaces/CustomerInputData';
import purchaseToken from '../services/purchaseTokenService';

function ConfigurationForm() {
  const [showLogs, setShowLogs] = useState(false);
  const [inputData, setInputData] = useState<ICustomerInputData>({
    walletAddress: '',
    password: '',
    tokenToBuy: '',
    provider: 'PancakeSwap',
    buyVia: '',
    amountToSpend: '',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '',
    usingMaxSlippage: 'true',
    apiCredits: '100000',
  });
  const port = 8080;

  const handleInputChange = (inputName: string, value: string) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [inputName]: value,
    }));
  };

  const startBotEndpoint = async () => {
    try {
      const startBotResponse = await fetch(
        `http://localhost:${port}/startBot`,
        {
          method: 'GET',
        }
      );
      if (startBotResponse.ok) {
        console.log('Bot started successfully');
      } else {
        console.error('Failed to start the bot');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleStartButton = async () => {
    await startBotEndpoint();
    setShowLogs(true);
    purchaseToken(inputData);
  };

  return (
    <div className="container">
      <form className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="title">
              MoonBot <i className="bi bi-moon" />
            </h1>
          </div>
          <div className="d-flex justify-content-end select-top-buttons">
            <SwapProviderSelect
              disabled={showLogs}
              availableData={[
                {
                  id: 'premNode',
                  value: 'Fastest Node',
                  icon: 'bi bi-lightning-charge',
                },
                // {
                //   id: 'customNode',
                //   value: 'Custom Node (HTTP)',
                //   icon: '',
                // },
              ]}
              handleInputChange={handleInputChange}
            />
            <SwapProviderSelect
              disabled={showLogs}
              availableData={[
                {
                  id: 'pancakeswap',
                  value: 'PancakeSwap',
                  icon: '',
                },
              ]}
              handleInputChange={handleInputChange}
            />
          </div>
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

      <LogContainer
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        buyingToken={inputData.buyVia}
        portNumber={port}
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
