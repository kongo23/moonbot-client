import { ICustomerInputData } from '../interfaces/CustomerInputData';

export async function startBotEndpointCall(
  port: number,
  inputData: ICustomerInputData
): Promise<number> {
  try {
    const startBotResponse = await fetch(`http://localhost:${port}/startBot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputData),
    });

    const statusCode = startBotResponse.status;
    if (startBotResponse.ok) {
      console.log('Bot started successfully');
    } else {
      console.error('Failed to start the bot');
    }

    return statusCode;
  } catch (error) {
    console.error('An error occurred:', error);
    return -1; // Return a custom error code or handle the error appropriately
  }
}

export const stopBotEndpointCall = async (port: number): Promise<number> => {
  try {
    const stopBotResponse = await fetch(`http://localhost:${port}/stopBot`, {
      method: 'GET',
    });

    const statusCode = stopBotResponse.status;
    if (stopBotResponse.ok) {
      console.log('Bot stopped successfully');
    } else {
      console.error('Failed to stop the bot');
    }

    return statusCode;
  } catch (error) {
    console.error('An error occurred:', error);
    return -1; // Return a custom error code or handle the error appropriately
  }
};

export const getLogsCall = async (
  port: number,
  counter: number
): Promise<string[]> => {
  const response = await fetch(
    `http://localhost:${port}/logs?counter=${counter}`,
    {
      method: 'GET',
    }
  );

  let latestLogs = [''];

  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      latestLogs = await response.json();
      return latestLogs;
    }
  } else {
    // TODO show error to user
    const text = await response.text();
    console.log(text);
  }
  return latestLogs;
};
