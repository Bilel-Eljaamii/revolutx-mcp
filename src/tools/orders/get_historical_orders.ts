import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getHistoricalOrdersTool: Tool = {
  name: "get_historical_orders",
  description: "Get historical crypto exchange orders for the requesting user.",
  inputSchema: {
    type: "object",
    properties: {
      symbols: {
        type: "string",
        description:
          "Filter historical orders by specific currency pairs (comma-separated)",
      },
      states: {
        type: "array",
        items: {
          type: "string",
          enum: ["filled", "cancelled", "rejected", "replaced"],
        },
        description: "Filter orders by specific states",
      },
      types: {
        type: "array",
        items: {
          type: "string",
          enum: ["market", "limit"],
        },
        description: "Filter orders by specific types",
      },
      start_date: {
        type: "integer",
        description:
          "Start timestamp for the query range in Unix epoch milliseconds",
      },
      end_date: {
        type: "integer",
        description:
          "End timestamp for the query range in Unix epoch milliseconds",
      },
      cursor: {
        type: "string",
        description: "Pagination cursor",
      },
      limit: {
        type: "integer",
        description: "Maximum number of records to return (default 1900)",
      },
    },
  },
};

interface GetHistoricalOrdersArgs {
  symbols?: string;
  states?: string[] | string;
  types?: string[] | string;
  start_date?: number;
  end_date?: number;
  cursor?: string;
  limit?: number;
}

export async function handleGetHistoricalOrders(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { symbols, states, types, start_date, end_date, cursor, limit } =
    (args as GetHistoricalOrdersArgs) || {};

  const params: Record<string, string | number> = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;
  if (symbols) params.symbols = symbols;
  if (states) params.states = Array.isArray(states) ? states.join(",") : states;
  if (types) params.types = Array.isArray(types) ? types.join(",") : types;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const searchParams = new URLSearchParams(params as Record<string, string>);
  const queryString = searchParams.toString();
  const path = "/api/1.0/orders/historical";
  const url = queryString
    ? `${REVOLUTX_API_URL}/orders/historical?${queryString}`
    : `${REVOLUTX_API_URL}/orders/historical`;

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
    return handleAxiosError(error, "fetching historical orders");
  }
}
