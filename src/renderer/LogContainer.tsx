import React from 'react';
import { Alert, Spinner, Button } from 'react-bootstrap';

interface LogContainerProps {
  showLogs: boolean;
  setShowLogs: React.Dispatch<React.SetStateAction<boolean>>;
}

function LogContainer({
  showLogs,
  setShowLogs,
}: LogContainerProps): React.JSX.Element {
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
      <p>Will buy token(s) as soon as liquidity added!</p>
      <hr />
      <p>Checking for liquidity...</p>
      <div className="d-flex justify-content-end">
        <Button onClick={() => setShowLogs(false)} variant="danger">
          Stop
        </Button>
      </div>
    </Alert>
  );
}

export default LogContainer;
