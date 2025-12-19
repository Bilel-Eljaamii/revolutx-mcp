import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  API_KEY,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

interface Balance {
  currency: string;
  available: string;
  reserved: string;
  total: string;
}

export const getBalancesTool: Tool = {
  name: "get_balances",
  description:
    "Get crypto exchange account balances for the requesting user. Requires REVOLUTX_API_KEY to be set.",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export async function handleGetBalances() {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  try {
    const response = await axios.get<Balance[]>(
      `${REVOLUTX_API_URL}/balances`,
      {
        headers: {
          Accept: "application/json",
          "X-API-KEY": API_KEY,
        },
        validateStatus: (status) => true, // Allow all status codes to be handled explicitly
      }
    );

    if (response.status === 200) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    }

    // Handle specific status codes explicitly
    return handleAxiosError({ response }, "fetching balances");
  } catch (error: any) {
    return handleAxiosError(error, "fetching balances");
  }
}
