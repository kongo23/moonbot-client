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
  const [logs, writeLogs] = useState<string[]>([]);
  const [inputData, setInputData] = useState<ICustomerInputData>({
    walletAddress: '0xbaaa950B2b980d9ebBC1300cBAb17A861988A825',
    walletKey: '',
    tokenToBuy: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    provider: 'PancakeSwap',
    buyingToken: '{token}',
    buyingTokenContract: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    amountToSpend: '0.01',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '0.1',
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

  useEffect(() => {
    const logNewEvent = (event: any, arg: any) => {
      if (arg[0] === 'Done!') {
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
      />
      <LogContainer
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        isFinished={isFinished}
        setFinished={setFinished}
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
