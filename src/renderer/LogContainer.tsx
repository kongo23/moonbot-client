import React, { useEffect, useRef, useState } from 'react';
import { Alert, Spinner, Button } from 'react-bootstrap';
import { getLogsCall, stopBotEndpointCall } from '../services/callerService';
import { v4 as uuidv4 } from 'uuid';

interface LogContainerProps {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
  buyingToken: string;
  portNumber: number;
}

function LogContainer({
  showLogs,
  setShowLogs,
  buyingToken,
  portNumber,
}: LogContainerProps): React.JSX.Element {
  const [logs, insertLog] = useState<string[]>([]);

  const logsEndpointCounter = useRef<number>(1);

  const retrieveLogs = async (port: number, counter: number) => {
    const latestLogs = await getLogsCall(port, counter);
    insertLog(latestLogs);
  };

  const stopBot = async () => {
    await stopBotEndpointCall(portNumber);
    insertLog(['']);
    setShowLogs(false);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (showLogs) {
      intervalId = setInterval(() => {
        retrieveLogs(portNumber, logsEndpointCounter.current);
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
        <div>
          <em>Checking for liquidity...</em> <br />
          {logs.map((log) => (
            <em key={uuidv4()}>{log}</em>
          ))}
        </div>
      )}
    </Alert>
  );
}

export default LogContainer;
