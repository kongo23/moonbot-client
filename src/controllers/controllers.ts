import { Request, Response } from 'express';
import {
  purchaseToken,
  stopPurchaseProcess,
  getLogs,
} from '../services/purchaseTokenService';

export const retrieveLogs = (req: Request, res: Response): void => {
  // const { counter } = req.query;
  const logs = getLogs();
  res.json(logs);
};

export const startBot = async (req: Request, res: Response): Promise<void> => {
  // simulateWork();
  // res.send('Started!');
  await purchaseToken(req.body);
  res.send('Started!');
};

export const stopBot = (req: Request, res: Response): void => {
  stopPurchaseProcess();
  // stopSimulation();
  res.send('Stopped!');
};
