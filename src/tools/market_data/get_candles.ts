import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getCandlesTool: Tool = {
  name: "get_candles",
  description:
    "Retrieve historical OHLCV (Open, High, Low, Close, Volume) candle data for a specific symbol.",
  inputSchema: {
    type: "object",
    properties: {
      symbol: {
        type: "string",
        description: "The trading pair symbol (e.g., BTC-USD)",
      },
      interval: {
        type: "integer",
        enum: [1, 5, 15, 30, 60, 240, 1440, 2880, 5760, 10080, 20160, 40320],
        description:
          "Time interval between candles in minutes (default: 5). Values: 1, 5, 15, 30, 60, 240, 1440, 2880, 5760, 10080, 20160, 40320",
      },
      from: {
        type: "integer",
        description:
          "Start timestamp in Unix epoch milliseconds. If omitted, up to 5000 candles leading up to 'until' will be returned.",
      },
      until: {
        type: "integer",
        description:
          "End timestamp in Unix epoch milliseconds. Defaults to current timestamp if omitted.",
      },
    },
    required: ["symbol"],
  },
};

interface GetCandlesArgs {
  symbol: string;
  interval?: number;
  from?: number;
  until?: number;
}

export async function handleGetCandles(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { symbol, interval, from, until } = args as GetCandlesArgs;

  const params: Record<string, string> = {};
  if (interval) params.interval = interval.toString();
  if (from) params.from = from.toString();
  if (until) params.until = until.toString();

  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  const path = `/api/1.0/market-data/candles/${symbol}`;
  const url = queryString
    ? `${REVOLUTX_API_URL}/market-data/candles/${symbol}?${queryString}`
    : `${REVOLUTX_API_URL}/market-data/candles/${symbol}`;

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
    return handleAxiosError(error, `fetching candles for ${symbol}`);
  }
}
