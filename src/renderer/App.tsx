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

  return (
    <div className="container">
      <form className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1>
              MoonBot <i className="bi bi-moon" />
            </h1>
          </div>
          <SwapProviderSelect disabled={showLogs} />
        </div>

        <DefaultInfoInput disabled={showLogs} />

        <BuyingTypeInput disabled={showLogs} />

        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <BuyViaSelect disabled={showLogs} />
          </div>
          <div className="d-flex justify-content-end">
            <SlippageOption disabled={showLogs} />
          </div>
        </div>

        <Button
          className="start-button"
          variant="primary"
          onClick={() => setShowLogs(true)}
          disabled={showLogs}
        >
          Start Bot <i className="bi bi-rocket-takeoff" />
        </Button>
      </form>
      {/* ******************* LOGS ******************* */}
      <LogContainer showLogs={showLogs} setShowLogs={setShowLogs} />
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
