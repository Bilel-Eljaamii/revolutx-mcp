import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getPrivateTradesTool: Tool = {
  name: "get_private_trades",
  description:
    "Retrieve the trade history (fills) for the authenticated client. The user context is resolved based on the provided API key.",
  inputSchema: {
    type: "object",
    properties: {
      symbol: {
        type: "string",
        description: "Trading pair symbol (e.g., BTC-USD)",
      },
      start_date: {
        type: "integer",
        description:
          "Start timestamp in Unix epoch milliseconds. Defaults to 7 days prior to end_date if omitted. Max range: 30 days.",
      },
      end_date: {
        type: "integer",
        description:
          "End timestamp in Unix epoch milliseconds. Defaults to current date if omitted. Max range: 30 days.",
      },
      cursor: {
        type: "string",
        description:
          "Pagination cursor obtained from the metadata.next_cursor property of the previous response.",
      },
      limit: {
        type: "integer",
        description:
          "Maximum number of records to return (1-1900, default 1900).",
      },
    },
  },
};

interface GetPrivateTradesArgs {
  symbol?: string;
  start_date?: number;
  end_date?: number;
  cursor?: string;
  limit?: number;
}

export async function handleGetPrivateTrades(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { symbol, start_date, end_date, cursor, limit } =
    (args as GetPrivateTradesArgs | undefined) ?? {};

  const params: Record<string, string> = {};
  if (symbol) params.symbol = symbol;
  if (start_date) params.start_date = start_date.toString();
  if (end_date) params.end_date = end_date.toString();
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit.toString();

  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  const path = "/api/1.0/trades/private";
  const url = queryString
    ? `${REVOLUTX_API_URL}/trades/private?${queryString}`
    : `${REVOLUTX_API_URL}/trades/private`;

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
    return handleAxiosError(error, "fetching private trades");
  }
}
