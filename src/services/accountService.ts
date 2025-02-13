import { ethers } from 'ethers';

export const connectToWallet = (mnemonic: string, nodeAddr: string) => {
  let nodeProvider: ethers.providers.WebSocketProvider;

  if (!nodeAddr) {
    nodeProvider = new ethers.providers.WebSocketProvider(
      'wss://little-falling-mansion.bsc.discover.quiknode.pro/id/'
    );
  } else {
    nodeProvider = new ethers.providers.WebSocketProvider(nodeAddr);
  }

  const wallet = new ethers.Wallet(mnemonic);
  return wallet.connect(nodeProvider);
};

// PancakeSwap V2 factory
export const getSwapRouter = (account: ethers.Wallet) => {
  return new ethers.Contract(
    '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external',
      'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) external payable',
      'function swapTokensForExactTokens(uint amountOut,uint amountInMax,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)',
      'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    ],
    account
  );
};

// PancakeSwap V2 router
export const getSwapFactory = (account: ethers.Wallet) => {
  return new ethers.Contract(
    '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    [
      'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
      'function getPair(address tokenA, address tokenB) external view returns (address pair)',
    ],
    account
  );
};
