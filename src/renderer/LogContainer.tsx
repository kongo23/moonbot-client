import React, { useEffect, useRef, useState } from 'react';
import { Alert, Spinner, Button } from 'react-bootstrap';
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

  const logsEndpointCounter = useRef<number>(0);

  const stopBotEndpoint = async (port: number) => {
    try {
      const startBotResponse = await fetch(`http://localhost:${port}/stopBot`, {
        method: 'GET',
      });
      if (startBotResponse.ok) {
        console.log('Bot stopped successfully');
      } else {
        console.error('Failed to stop the bot');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const getLogs = async (port: number, counter: number) => {
    const response = await fetch(
      `http://localhost:${port}/logs?counter=${counter}`,
      {
        method: 'GET',
      }
    );

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const latestLogs = await response.json();
        insertLog(latestLogs);
      } else {
        const text = await response.text();
        console.log(text);
      }
    }
  };
  const stopBot = () => {
    stopBotEndpoint(portNumber);
    setShowLogs(false);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (showLogs) {
      intervalId = setInterval(() => {
        getLogs(portNumber, logsEndpointCounter.current);
        logsEndpointCounter.current += 1;
      }, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        logsEndpointCounter.current = 0;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLogs]);

  return (
    <Alert show={showLogs} variant="primary">
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
      <p>Will buy token(s) for {buyingToken} as soon as liquidity added!</p>
      <hr />
      {logs.length > 0 && (
        <div>
          {logs.map((log) => (
            <p key={uuidv4()}>{log.trim()}</p>
          ))}
        </div>
      )}
      <div className="d-flex justify-content-end">
        <Button onClick={() => stopBot()} variant="danger">
          Stop
        </Button>
      </div>
    </Alert>
  );
}

export default LogContainer;
