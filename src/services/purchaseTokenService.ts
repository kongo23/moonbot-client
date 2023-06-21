import { ICustomerInputData } from '../interfaces/CustomerInputData';

export default function purchaseToken(
  inputData: ICustomerInputData
): ICustomerInputData {
  console.log(inputData);
  return inputData;
}
