import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";
export const getApiKey = () => process.env.REVOLUTX_API_KEY;
export const getPrivateKey = () => process.env.REVOLUTX_PRIVATE_KEY;

export function getAuthHeaders(
  method: string,
  path: string,
  body = "",
  query = "",
) {
  const timestamp = Date.now().toString();
  const privateKey = getPrivateKey();

  if (!privateKey) {
    throw new Error(
      "REVOLUTX_PRIVATE_KEY is not set. An Ed25519 private key is required for request signing.",
    );
  }

  const formattedPrivateKey = privateKey.includes("BEGIN PRIVATE KEY")
    ? privateKey
    : `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;

  const message = `${timestamp}${method.toUpperCase()}${path}${query}${body}`;
  const signatureBuffer = crypto.sign(
    null,
    Buffer.from(message),
    formattedPrivateKey,
  );
  const signature = signatureBuffer.toString("base64");

  return {
    "X-Revx-API-Key": getApiKey(),
    "X-Revx-Timestamp": timestamp,
    "X-Revx-Signature": signature,
  };
}

export type ToolArguments = Record<
  string,
  string | number | boolean | undefined
>;

export function handleAxiosError(error: unknown, context: string) {
  let errorMessage = `Error ${context}: `;

  if (axios.isAxiosError(error)) {
    errorMessage += error.message;
    if (error.response) {
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
            errorMessage = `Server Error: The Revolut X server encountered an error (Status: ${String(status)}). Please try again later. ${data}`;
          } else {
            errorMessage += ` (Status: ${String(status)}, Data: ${data})`;
          }
      }
    }
  } else if (error instanceof Error) {
    errorMessage += error.message;
  } else {
    errorMessage += String(error);
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
  const apiKey = getApiKey();
  const privateKey = getPrivateKey();
  if (!apiKey || !privateKey) {
    return {
      content: [
        {
          type: "text",
          text: "Error: REVOLUTX_API_KEY and REVOLUTX_PRIVATE_KEY environment variables are required for this tool.",
        },
      ],
      isError: true,
    };
  }
  return null;
}
