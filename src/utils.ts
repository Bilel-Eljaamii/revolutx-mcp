import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";
export const API_KEY = process.env.REVOLUTX_API_KEY;

export function handleAxiosError(error: any, context: string) {
  let errorMessage = `Error ${context}: ${error.message}`;

  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    const data = JSON.stringify(error.response.data);

    switch (status) {
      case 401:
        errorMessage = `Unauthorized: Your API key is invalid or expired. ${data}`;
        break;
      case 403:
        errorMessage = `Forbidden: You do not have permission to access this resource. ${data}`;
        break;
      case 409:
        errorMessage = `Conflict: The request could not be completed due to a conflict with the current state of the resource. ${data}`;
        break;
      default:
        if (status >= 500) {
          errorMessage = `Server Error: The Revolut X server encountered an error (Status: ${status}). Please try again later. ${data}`;
        } else {
          errorMessage += ` (Status: ${status}, Data: ${data})`;
        }
    }
  }

  return {
    content: [
      {
        type: "text",
        text: errorMessage,
      },
    ],
    isError: true,
  };
}

export function checkApiKey() {
  if (!API_KEY) {
    return {
      content: [
        {
          type: "text",
          text: "Error: REVOLUTX_API_KEY environment variable is required for this tool.",
        },
      ],
      isError: true,
    };
  }
  return null;
}
