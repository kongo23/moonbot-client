/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import ParticlesContainer from './ParticlesContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import MainForm from './MainForm';
import LogContainer from './LogContainer';

import { ICustomerInputData } from '../interfaces/CustomerInputData';

function ConfigurationForm() {
  const [showLogs, setShowLogs] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const [isTimeout, setTimeout] = useState(false);
  const [logs, writeLogs] = useState<string[]>([]);
  const [inputData, setInputData] = useState<ICustomerInputData>({
    walletAddress: '',
    walletKey: '',
    tokenToBuy: '',
    provider: 'PancakeSwap',
    nodeAddr: '',
    buyingToken: '',
    buyingTokenContract: '',
    amountToSpend: '',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '',
    usingMaxSlippage: 'true',
    apiCredits: '100000',
  });

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

  const handleStopButton = async () => {
    try {
      window.electron.ipcRenderer.sendMessage(
        'transmitUserInputToMainProcess',
        ['STOP']
      );
      setShowLogs(false);
      setFinished(false);
      setTimeout(false);
      writeLogs([]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const logNewEvent = (event: any, arg: any) => {
      if (arg[0] === 'TIMEOUT') {
        setTimeout(true);
      }
      if (arg[0] === 'DONE') {
        setFinished(true);
      }
      writeLogs((prevLogs) => [...prevLogs, ...arg]);
    };
    window.electron.ipcRenderer.on('sendLogToUi', logNewEvent);
    return () => {
      window.electron.ipcRenderer.removeListener('sendLogToUi', logNewEvent);
    };
  }, []);

  return (
    <div className="container">
      <ParticlesContainer />
      <MainForm
        showLogs={showLogs}
        inputData={inputData}
        handleInputChange={handleInputChange}
        handleStartButton={handleStartButton}
        isDisabledStartBtn={
          inputData.walletAddress === '' ||
          inputData.walletKey === '' ||
          inputData.tokenToBuy === '' ||
          inputData.buyingToken === '' ||
          (inputData.amountToSpend === '' &&
            (inputData.numberOfTokensToBuy === '' ||
              inputData.maxSpendingLimit === ''))
        }
      />
      <LogContainer
        showLogs={showLogs}
        isFinished={isFinished}
        isTimeout={isTimeout}
        logs={logs}
        buyingToken={inputData.buyingToken}
        handleStopButton={handleStopButton}
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
