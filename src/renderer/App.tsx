/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import DefaultInfoInput from './DefaultInfoInput';
import BuyingTypeInput from './BuyingTypeInput';
import LogContainer from './LogContainer';
import BuyViaSelect from './BuyViaSelect';
import SwapProviderSelect from './SwapProviderSelect';
// import SlippageOption from './SlippageOption';

import { ICustomerInputData } from '../interfaces/CustomerInputData';

function ConfigurationForm() {
  const [showLogs, setShowLogs] = useState(false);
  const [logs, writeLogs] = useState<string[]>([]);
  const [inputData, setInputData] = useState<ICustomerInputData>({
    walletAddress: '0xbaaa950B2b980d9ebBC1300cBAb17A861988A825',
    walletKey: '',
    tokenToBuy: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    provider: 'PancakeSwap',
    buyingToken: 'token equivalent',
    buyingTokenContract: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    amountToSpend: '0.01',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '0.1',
    usingMaxSlippage: 'true',
    apiCredits: '100000',
  });

  useEffect(() => {
    const logNewEvent = (event: any, arg: any) => {
      writeLogs((prevLogs) => [...prevLogs, ...arg]);
    };

    window.electron.ipcRenderer.on('sendLogToUi', logNewEvent);

    return () => {
      // Clean up the event listener when the component unmounts
      window.electron.ipcRenderer.removeListener('sendLogToUi', logNewEvent);
    };
  }, []); // Empty dependency array to run the effect only once

  const handleInputChange = (inputName: string, value: string) => {
    setInputData((prevInputData) => ({
      ...prevInputData,
      [inputName]: value,
    }));
  };

  const handleStartButton = async () => {
    try {
      window.electron.ipcRenderer.sendMessage(
        'transmitUserInputToMainProcess',
        [inputData]
      );
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
            {/* <SlippageOption
              disabled={showLogs}
              handleInputChange={handleInputChange}
            /> */}
            <a
              href="#"
              className="advanceSettings"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Coming soon!"
            >
              Advanced settings
            </a>
          </div>
        </div>
        <BuyingTypeInput
          disabled={showLogs}
          handleInputChange={handleInputChange}
          selectedCurrency={inputData.buyingToken}
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
        logs={logs}
        writeLogs={writeLogs}
        buyingToken={inputData.buyingToken}
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
