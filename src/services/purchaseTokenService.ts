import { ethers } from 'ethers';
import abi from 'human-standard-token-abi';
import {
  connectToWallet,
  getSwapRouter,
  getSwapFactory,
} from './accountService';
import { ICustomerInputData } from '../interfaces/CustomerInputData';

const shouldBeValidated = true;
let processInterval: ReturnType<typeof setTimeout> | undefined;
const logs = [''];

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
  if (!inputData.amountToSpend) {
    missingProperties.push('amountToSpend');
  }
  if (!inputData.amountToSpend && !inputData.numberOfTokensToBuy) {
    missingProperties.push('numberOfTokensToBuy');
  }
  if (!inputData.maxSpendingLimit) {
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
  console.log(`Check for approval`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Check for approval`,
  ]);

  const router = getSwapRouter(account);

  console.log(`router address: ${router.address}`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `router address: ${router.address}`,
  ]);

  const contract = new ethers.Contract(thisTokenAddress, abi, account);

  console.log(`contract instance to buy: ${contract.address}`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `contract instance to buy: ${contract.address}`,
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
  console.log(`Buying explicitly via token value`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Buying explicitly via token value`,
  ]);

  const amountIn = amountToSpend;
  const amounOutMin = 0; // doesn't matter using int small value
  const amountInParsed = ethers.utils.parseUnits(`${amountIn}`, 'ether');

  console.log(`amountInParsed: ${amountInParsed}`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `amountInParsed: ${amountInParsed}`,
  ]);

  // const tx = await router.swapExactETHForTokens(
  //   amounOutMin,
  //   [tokenIn, tokenOut],
  //   walletAddress,
  //   Date.now() + 1000 * 60 * 5,
  //   {
  //     value: amountInParsed,
  //     gasLimit: 1000000, // Minimum limit is 21000, more much more better.
  //     gasPrice: ethers.utils.parseUnits('25', 'gwei'), // If you buy early token recommended 15+ GWEI
  //   }
  // );


  // refactor this
  // const receipt = await tx.wait();
  // console.log(
  //   `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`
  // );
  // window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
  //   `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`,
  // ]);
  // logs.push(
  //   `Transaction receipt : https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`
  // );
  // return receipt;
  return '';
};

const checkLiquidityAndBuy = async (
  account: ethers.Wallet,
  inputData: ICustomerInputData
) => {
  const factory = getSwapFactory(account);

  console.log(`factory: ${factory.address}`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `factory: ${factory.address}`,
  ]);

  const pairAddressx = await factory.getPair(
    inputData.buyingTokenContract,
    inputData.tokenToBuy
  );

  console.log(`pairAddress: ${pairAddressx}`);
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `pairAddress: ${pairAddressx}`,
  ]);

  if (pairAddressx !== null && pairAddressx !== undefined) {
    if (pairAddressx.toString().indexOf('0x0000000000000') > -1) {
      console.log(
        `pairAddress ${pairAddressx} at ${Date.now()} not detected. Auto restart`
      );
      window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
        `pairAddress ${pairAddressx} at ${Date.now()} not detected. Auto restart`,
      ]);

      processInterval = setTimeout(() => {
        checkLiquidityAndBuy(account, inputData);
      }, 3000);
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

  await buyUsingSingleTokenAmount(
    router,
    inputData.amountToSpend,
    inputData.buyingTokenContract,
    inputData.tokenToBuy,
    inputData.walletAddress
  );

  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Done!`,
  ]);
};

export const getLogs = () => {
  return logs;
};

export const stopPurchaseProcess = () => {
  clearTimeout(processInterval);
};

export const purchaseToken = async (customerInputData: ICustomerInputData) => {
  window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
    `Received buyingToken: ${customerInputData.buyingToken}`,
  ]);

  const defaultInputData: ICustomerInputData = {
    walletAddress: '0xbaaa950B2b980d9ebBC1300cBAb17A861988A825',
    walletKey: '',
    tokenToBuy: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    provider: 'PancakeSwap',
    buyingToken: 'BNB',
    buyingTokenContract: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    amountToSpend: '0.01',
    numberOfTokensToBuy: '',
    maxSpendingLimit: '0.1',
    usingMaxSlippage: 'true',
    apiCredits: '100000',
  };

  if (shouldBeValidated) {
    const missingProperties = validateInputData(defaultInputData);
    if (missingProperties.length > 0) {
      window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
        `Invalid Input! Missing fields: ${missingProperties}`,
      ]);

      return;
    }
  }

  try {
    const account = connectToWallet(defaultInputData.walletKey);
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `connected: ${account.address}`,
    ]);

    await getApproval(
      defaultInputData.tokenToBuy,
      account,
      Number.MAX_SAFE_INTEGER
    );
    await checkLiquidityAndBuy(account, defaultInputData);
  } catch (error) {
    window.electron.ipcRenderer.sendMessage('transmitLogToMainProcess', [
      `Failed! Error: ${error}`,
    ]);
  }
};
