import React, { useEffect, useRef, useState } from 'react';
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
  // const [logs, insertLog] = useState<string[]>([]);

  const logsEndpointCounter = useRef<number>(1);

  const stopBot = async () => {
    // await stopBotEndpointCall(portNumber);
    // writeLogs(['']);
    setShowLogs(false);
    writeLogs([]);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (showLogs) {
      intervalId = setInterval(() => {
        // retrieveLogs(portNumber, logsEndpointCounter.current);
        logsEndpointCounter.current += 1;
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        logsEndpointCounter.current = 1;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLogs]);

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
        <div className="d-flex justify-content-end">
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
