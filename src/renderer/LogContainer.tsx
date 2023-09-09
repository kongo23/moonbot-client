import React from 'react';
import { Alert, Spinner, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

interface LogContainerProps {
  showLogs: boolean;
  isFinished: boolean;
  isTimeout: boolean;
  logs: string[];
  buyingToken: string;
  handleStopButton: () => void;
}

function LogContainer({
  showLogs,
  isFinished,
  isTimeout,
  logs,
  buyingToken,
  handleStopButton,
}: LogContainerProps): React.JSX.Element {
  const stopBot = async () => {
    handleStopButton();
  };

  const logWithLinks = (log: string) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the log message by URLs and return an array of text and link elements
    const parts = log.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        // If part is a URL, create a clickable link
        return (
          // eslint-disable-next-line react/no-array-index-key
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            link
          </a>
        );
      }
      // If part is plain text, return it as is
      return part;
    });

    return parts;
  };

  return (
    <Alert show={showLogs} variant="primary">
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-start">
          {isFinished ? (
            <Alert.Heading>
              Finished! <i className="bi bi-check-circle-fill checkmark" />
            </Alert.Heading>
          ) : (
            <Alert.Heading>
              {!isTimeout ? 'Running ' : 'TIMEOUT - Please retry'}
              {!isTimeout ? (
                <Spinner
                  className="spinner"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  variant="info"
                  aria-hidden="true"
                />
              ) : null}
            </Alert.Heading>
          )}
        </div>
        <div className="d-flex justify-content-end logsHeader">
          {isFinished ? (
            <Button onClick={() => stopBot()} variant="success">
              Close
            </Button>
          ) : (
            <Button onClick={() => stopBot()} variant="danger">
              Stop
            </Button>
          )}
        </div>
      </div>
      <p>
        Will purchase token(s) for {buyingToken} as soon as liquidity added!
      </p>
      <hr />
      {logs.length > 0 && (
        <ul className="logs-data">
          {logs.map((log) => (
            <li key={uuidv4()}>{logWithLinks(log)}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
}

export default LogContainer;
