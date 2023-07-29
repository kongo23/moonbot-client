import { createRoot } from 'react-dom/client';
import {
  purchaseToken,
  stopPurchaseProcess,
  getLogs,
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

window.electron.ipcRenderer.on('userInputFromMain', async (event, arg) => {
  console.log(`Received user input into worker: ${arg}`);

  await purchaseToken();

  // window.electron.ipcRenderer.sendMessage('messageFromWorker', [
  //   'Purchased from Worker!',
  // ]);
});
