import { ethers } from 'ethers';
import abi from 'human-standard-token-abi';
import {
  connectToWallet,
  getSwapRouter,
  getSwapFactory,
} from './accountService';
import { ICustomerInputData } from '../interfaces/CustomerInputData';

const shouldBeValidated = true;
let buyingAttemptCounter = 0;
const maxAllowedAttempts = 4800; // 4 hours (using 3s delay)
let processInterval: ReturnType<typeof setTimeout> | undefined;

const validateInputData = (inputData: ICustomerInputData) => {
  const missingProperties: string[] = [];

  if (!inputData.walletAddress) {
    missingProperties.push('walletAddress');
  }
  if (!inputData.walletKey) {
    missingProperties.push('walletKey');
  }
  if (!inputData.tokenToBuy) {
    missingProperties.push('tokenToBuy');
  }
  if (!inputData.provider) {
    missingProperties.push('provider');
  }
  if (!inputData.buyingToken) {
    missingProperties.push('buyingToken');
  }
  if (!inputData.buyingTokenContract) {
    missingProperties.push('buyingTokenContract');
  }
  if (!inputData.numberOfTokensToBuy && !inputData.amountToSpend) {
    missingProperties.push('amountToSpend');
  }
  if (!inputData.amountToSpend && !inputData.numberOfTokensToBuy) {
    missingProperties.push('numberOfTokensToBuy');
  }
  if (!inputData.amountToSpend && !inputData.maxSpendingLimit) {
    missingProperties.push('maxSpendingLimit');
  }
  if (!inputData.usingMaxSlippage) {
    missingProperties.push('usingMaxSlippage');
  }
  if (!inputData.apiCredits) {
    missingProperties.push('apiCredits');
  }

  return missingProperties;
};

const getApproval = async (
  thisTokenAddress: string,
  account: ethers.Wallet,
  approvalAmount: number
) => {
  const router = getSwapRouter(account);

  console.log(`router: ${router.address}`);

  const contract = new ethers.Contract(thisTokenAddress, abi, account);

  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Purchase: ${contract.address}`,
  ]);

  const allowanceVal = await contract.allowance(
    account.address,
    router.address
  );

  console.log(`allowanceVal: ${allowanceVal}`);

  const parseVal = ethers.utils.formatEther(allowanceVal);

  console.log(`parseVal: ${parseVal}`);

  if (parseFloat(parseVal) === 0) {
    console.log(`Getting approval`);
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `Getting approval`,
    ]);

    const amount = ethers.utils.parseUnits(`${approvalAmount}`, 'ether');
    await contract.approve(router.address, amount).catch((err: any) => {
      console.log(err);
      window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
        err,
      ]);
    });
  }
};

const buyUsingSingleTokenAmount = async (
  router: ethers.Contract,
  amountToSpend: string,
  tokenIn: string,
  tokenOut: string,
  walletAddress: string
) => {
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Buying max amount of token(s)`,
  ]);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `amountToSpend: ${amountToSpend}`,
  ]);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `tokenIn: ${tokenIn}`,
  ]);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `tokenIn: ${tokenOut}`,
  ]);
  const amounOutMin = 0; // doesn't matter using int small value
  const amountInParsed = ethers.utils.parseUnits(`${amountToSpend}`, 'ether');
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `amountInParsed: ${amountInParsed}`,
  ]);

  const tx = await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amountInParsed,
    amounOutMin,
    [tokenIn, tokenOut],
    walletAddress,
    Date.now() + 1000 * 60 * 5,
    {
      gasLimit: 800000, // Minimum limit is 21000, more much more better.
      gasPrice: ethers.utils.parseUnits('30', 'gwei'), // If you buy early token recommended 15+ GWEI
    }
  );

  // refactor this
  const receipt = await tx.wait();
  console.log(
    `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`
  );
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Transaction receipt:
     https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`,
  ]);
  return receipt;
};

// possible EXCESSIVE_INPUT_AMOUNT if amountInMax was not enough
const buyUsingTokensOutputAmount = async (
  router: ethers.Contract,
  numberOfTokensToBuy: string,
  maxSpendingLimit: string,
  tokenIn: string,
  tokenOut: string,
  walletAddress: string
) => {
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Buying explicit number of token(s)`,
  ]);

  const numberOfTokensOut = ethers.utils.parseUnits(numberOfTokensToBuy);
  const maxAmountIn = ethers.utils.parseUnits(`${maxSpendingLimit}`, 'ether');

  const tx = await router.swapTokensForExactTokens(
    numberOfTokensOut,
    maxAmountIn,
    [tokenIn, tokenOut],
    walletAddress,
    Date.now() + 1000 * 60 * 5,
    {
      gasLimit: 800000, // Minimum limit is 21000, more much more better.
      gasPrice: ethers.utils.parseUnits('30', 'gwei'), // If you buy early token recommended 15+ GWEI
    }
  );

  const receipt = await tx.wait();
  console.log(
    `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`
  );
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Transaction receipt:
     https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`,
  ]);
  return receipt;
};

const checkLiquidityAndBuy = async (
  account: ethers.Wallet,
  inputData: ICustomerInputData
) => {
  const factory = getSwapFactory(account);

  if (!buyingAttemptCounter) {
    console.log(`factory: ${factory.address}`);
  }

  const pairAddressx = await factory.getPair(
    inputData.buyingTokenContract,
    inputData.tokenToBuy
  );

  if (!buyingAttemptCounter) {
    console.log(`pairAddress: ${pairAddressx}`);
  }

  // REFACTOR
  if (pairAddressx !== null && pairAddressx !== undefined) {
    if (pairAddressx.toString().indexOf('0x0000000000000') > -1) {
      window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
        `Liquidity at ${new Date().toLocaleTimeString()} not detected. Auto restart`,
      ]);

      if (buyingAttemptCounter <= maxAllowedAttempts) {
        buyingAttemptCounter += 1;

        processInterval = setTimeout(() => {
          checkLiquidityAndBuy(account, inputData);
        }, 3000);
      } else {
        window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
          `TIMEOUT`,
        ]);
      }
      return;
    }
  }

  const erc = new ethers.Contract(
    inputData.buyingTokenContract,
    [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        payable: false,
        type: 'function',
      },
    ],
    account
  );

  const pairBNBvalue = await erc.balanceOf(pairAddressx);
  const jmlBnb = ethers.utils.formatEther(pairBNBvalue);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Liquidity: ${parseInt(jmlBnb, 10) * 2}`,
  ]);

  // TODO refactor
  const router = getSwapRouter(account);

  if (inputData.amountToSpend) {
    await buyUsingSingleTokenAmount(
      router,
      inputData.amountToSpend,
      inputData.buyingTokenContract,
      inputData.tokenToBuy,
      inputData.walletAddress
    );
  } else {
    await buyUsingTokensOutputAmount(
      router,
      inputData.numberOfTokensToBuy,
      inputData.maxSpendingLimit,
      inputData.buyingTokenContract,
      inputData.tokenToBuy,
      inputData.walletAddress
    );
  }

  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [`DONE`]);
};

export const stopPurchaseProcess = () => {
  clearTimeout(processInterval);
};

// REFACTOR
export const purchaseToken = async (customerInputData: ICustomerInputData) => {
  // eslint-disable-next-line no-param-reassign
  buyingAttemptCounter = 0;

  // customerInputData = {
  //   walletAddress: '0xbaaa950B2b980d9ebBC1300cBAb17A861988A825',
  //   walletKey: '',
  //   tokenToBuy: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  //   provider: 'PancakeSwap',
  //   buyingToken: 'BNB',
  //   buyingTokenContract: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  //   amountToSpend: '',
  //   numberOfTokensToBuy: '1001',
  //   maxSpendingLimit: '3',
  //   usingMaxSlippage: 'true',
  //   apiCredits: '100000',
  // };

  if (shouldBeValidated) {
    const missingProperties = validateInputData(customerInputData);
    if (missingProperties.length > 0) {
      window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
        `Invalid Input! Missing fields: ${missingProperties}`,
      ]);

      return;
    }
  }

  if (!customerInputData.numberOfTokensToBuy) {
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `Buying max amount of token(s) for ${customerInputData.amountToSpend} ${customerInputData.buyingToken}!`,
    ]);
  } else {
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `Buying ${customerInputData.numberOfTokensToBuy} token(s) for no more than ${customerInputData.maxSpendingLimit} ${customerInputData.buyingToken}!`,
    ]);
  }

  try {
    const account = connectToWallet(customerInputData.walletKey);
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `Wallet: ${account.address}`,
    ]);

    await getApproval(
      customerInputData.tokenToBuy,
      account,
      Number.MAX_SAFE_INTEGER
    );
    await checkLiquidityAndBuy(account, customerInputData);
  } catch (error) {
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `Failed! Error: ${error}`,
    ]);
  }
};
