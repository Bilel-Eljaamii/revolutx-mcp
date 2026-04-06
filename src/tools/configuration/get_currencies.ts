import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getCurrenciesTool: Tool = {
  name: "get_currencies",
  description: "Get configuration for all currencies used on the exchange.",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export async function handleGetCurrencies() {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  try {
    const response = await axios.get(
      `${REVOLUTX_API_URL}/configuration/currencies`,
      {
        headers: {
          Accept: "application/json",
          ...getAuthHeaders("GET", "/api/1.0/configuration/currencies"),
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
    return handleAxiosError(error, "fetching currencies");
  }
}
