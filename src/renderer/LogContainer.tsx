import React from 'react';
import { Alert, Spinner, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

interface LogContainerProps {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
  logs: string[];
  writeLogs: React.Dispatch<React.SetStateAction<string[]>>;
  buyingToken: string;
}

function LogContainer({
  showLogs,
  setShowLogs,
  logs,
  writeLogs,
  buyingToken,
}: LogContainerProps): React.JSX.Element {
  const stopBot = async () => {
    setShowLogs(false);
    writeLogs([]);
  };

  return (
    <Alert show={showLogs} variant="primary">
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">
          <Alert.Heading>
            Running{' '}
            <Spinner
              className="spinner"
              as="span"
              animation="border"
              size="sm"
              role="status"
              variant="info"
              aria-hidden="true"
            />
          </Alert.Heading>
        </div>
        <div className="d-flex justify-content-end logsHeader">
          <Button onClick={() => stopBot()} variant="danger">
            Stop
          </Button>
        </div>
      </div>
      <p>Will buy token(s) for {buyingToken} as soon as liquidity added!</p>
      <hr />
      {logs.length > 0 && (
        <ul className="logs-data">
          {logs.map((log) => (
            <li key={uuidv4()}>{log}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
}

export default LogContainer;
