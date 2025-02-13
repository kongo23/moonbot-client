import { ICustomerInputData } from 'interfaces/CustomerInputData';
import { Button } from 'react-bootstrap';
import SwapProviderSelect from './SwapProviderSelect';
import BuyViaSelect from './BuyViaSelect';
import BuyingTypeInput from './BuyingTypeInput';
import DefaultInfoInput from './DefaultInfoInput';
import icon from '../../assets/32x32.png';

interface IMainFormProps {
  showLogs: boolean;
  inputData: ICustomerInputData;
  // eslint-disable-next-line no-unused-vars
  handleInputChange: (inputName: string, value: string) => void;
  handleStartButton: () => void;
  isDisabledStartBtn: boolean;
}

function MainForm({
  showLogs,
  inputData,
  handleInputChange,
  handleStartButton,
  isDisabledStartBtn,
}: IMainFormProps) {
  return (
    <div className="mainForm">
      <form className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="title">
              <img src={icon} alt="Icon" className="icon" />
              <span>MoonBot</span>
            </h1>
          </div>
          <div className="d-flex justify-content-end select-top-buttons">
            <SwapProviderSelect
              disabled={showLogs}
              availableData={[
                {
                  id: 'premNode',
                  value: 'Premium Node',
                  icon: 'bi bi-lightning-charge',
                },
                {
                  id: 'custom',
                  value: 'Other Node',
                  icon: '',
                },
              ]}
              handleInputChange={handleInputChange}
              id="nodeAddr"
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
              id="provider"
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
            <span className="advanceSettings">Advanced settings </span> <span> &#160; &#9660;</span>
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
          disabled={showLogs || isDisabledStartBtn}
        >
          Start Bot <i className="bi bi-rocket-takeoff" />
        </Button>
      </form>
    </div>
  );
}

export default MainForm;
