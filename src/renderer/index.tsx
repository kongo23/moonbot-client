import { createRoot } from 'react-dom/client';
import {
  purchaseToken,
  stopPurchaseProcess,
} from '../services/purchaseTokenService';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.on(
  'sendUserInputToWorker',
  async (_event: any, arg: any) => {
    if (arg[0] === 'STOP') {
      stopPurchaseProcess();
      return;
    }

    if (Array.isArray(arg)) {
      arg.map(async (customerInput) => {
        await purchaseToken(customerInput);
      });
    } else {
      console.error('Invalid argument:', arg);
    }
  }
);
