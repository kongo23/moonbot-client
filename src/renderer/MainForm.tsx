import { ICustomerInputData } from 'interfaces/CustomerInputData';
import { Button } from 'react-bootstrap';
import SwapProviderSelect from './SwapProviderSelect';
import BuyViaSelect from './BuyViaSelect';
import BuyingTypeInput from './BuyingTypeInput';
import DefaultInfoInput from './DefaultInfoInput';

interface IMainFormProps {
  showLogs: boolean;
  inputData: ICustomerInputData;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (inputName: string, value: string) => void;
  handleStartButton: () => void;
}

function MainForm({
  showLogs,
  inputData,
  handleInputChange,
  handleStartButton,
}: IMainFormProps) {
  return (
    <div className="mainForm">
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
          <div className="d-flex justify-content-end advanced-settings">
            {/* <SlippageOption
              disabled={showLogs}
              handleInputChange={handleInputChange}
            /> */}
            <i className="advanceSettings">Advanced settings coming soon!</i>
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
    </div>
  );
}

export default MainForm;
