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
import { startBotEndpointCall } from '../services/callerService';
import {
  purchaseToken,
  stopPurchaseProcess,
} from '../services/purchaseTokenService';

function ConfigurationForm() {
  const [showLogs, setShowLogs] = useState(false);
  const [inputData, setInputData] = useState<ICustomerInputData>({
    walletAddress: '0xbaaa950B2b980d9ebBC1300cBAb17A861988A825',
    walletKey: '',
    tokenToBuy: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    provider: 'PancakeSwap',
    buyingCurrency: 'BNB',
    buyingTokenContract: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    amountToSpend: '0.01',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '0.1',
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

  const handleStartButton = async () => {
    try {
      await startBotEndpointCall(port, inputData);
      // await purchaseToken(inputData);
      setShowLogs(true);
    } catch (e) {
      console.log(e);
    }
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
        <div className="d-flex justify-content-between buy-via-block">
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
        <BuyingTypeInput
          disabled={showLogs}
          handleInputChange={handleInputChange}
          selectedCurrency={inputData.buyingCurrency}
        />
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
        buyingToken={inputData.buyingCurrency}
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
