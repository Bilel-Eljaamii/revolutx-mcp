import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
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
  description: "Get crypto exchange account balances for the requesting user.",
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
          ...getAuthHeaders("GET", "/api/1.0/balances"),
        },
      },
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    return handleAxiosError(error, "fetching balances");
  }
}
