import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getTickersTool: Tool = {
  name: "get_tickers",
  description:
    "Retrieves the latest market data snapshots for all supported currency pairs. Includes best bid/ask prices, mid-price, and last traded price.",
  inputSchema: {
    type: "object",
    properties: {
      symbols: {
        type: "string",
        description:
          "Filter tickers by specific currency pairs (comma-separated, e.g., BTC-USD,ETH-USD)",
      },
    },
  },
};

interface GetTickersArgs {
  symbols?: string;
}

export async function handleGetTickers(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { symbols } = (args as GetTickersArgs) || {};

  const params: Record<string, string> = {};
  if (symbols) params.symbols = symbols;

  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  const path = "/api/1.0/market-data/ticker";
  const url = queryString
    ? `${REVOLUTX_API_URL}/market-data/ticker?${queryString}`
    : `${REVOLUTX_API_URL}/market-data/ticker`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        ...getAuthHeaders("GET", path, "", queryString),
      },
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    return handleAxiosError(error, "fetching tickers");
  }
}
