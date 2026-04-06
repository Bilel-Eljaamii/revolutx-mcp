import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getPairsTool: Tool = {
  name: "get_pairs",
  description: "Get configuration for all traded currency pairs.",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export async function handleGetPairs() {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  try {
    const response = await axios.get(
      `${REVOLUTX_API_URL}/configuration/pairs`,
      {
        headers: {
          Accept: "application/json",
          ...getAuthHeaders("GET", "/api/1.0/configuration/pairs"),
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
    return handleAxiosError(error, "fetching pairs");
  }
}
