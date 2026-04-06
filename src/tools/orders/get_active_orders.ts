import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  handleAxiosError,
  checkApiKey,
  getAuthHeaders,
} from "../../utils.js";

export const getActiveOrdersTool: Tool = {
  name: "get_active_orders",
  description:
    "Get active crypto exchange orders for the requesting user. Requires REVOLUTX_API_KEY.",
  inputSchema: {
    type: "object",
    properties: {
      cursor: {
        type: "string",
        description: "Cursor for pagination, obtained from metadata.nextCursor",
      },
      limit: {
        type: "integer",
        description: "Maximum number of records returned (default: 100)",
      },
      symbols: {
        type: "string",
        description:
          "Filter active orders by specific currency pairs (comma-separated)",
      },
      states: {
        type: "array",
        items: {
          type: "string",
          enum: ["pending_new", "new", "partially_filled"],
        },
        description: "Filter orders by specific states",
      },
      types: {
        type: "array",
        items: {
          type: "string",
          enum: ["limit", "conditional", "tpsl"],
        },
        description: "Filter orders by specific types",
      },
      side: {
        type: "string",
        enum: ["buy", "sell"],
        description: "Filter by order direction (buy or sell)",
      },
    },
  },
};

interface GetActiveOrdersArgs {
  cursor?: string;
  limit?: number;
  symbols?: string;
  states?: string[] | string;
  types?: string[] | string;
  side?: "buy" | "sell";
}

export async function handleGetActiveOrders(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { cursor, limit, symbols, states, types, side } =
    (args as GetActiveOrdersArgs | undefined) ?? {};

  const params: Record<string, string | number> = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = limit;
  if (symbols) params.symbols = symbols;
  if (states) params.states = Array.isArray(states) ? states.join(",") : states;
  if (types) params.types = Array.isArray(types) ? types.join(",") : types;
  if (side) params.side = side;

  const searchParams = new URLSearchParams(params as Record<string, string>);
  const queryString = searchParams.toString();
  const url = queryString
    ? `${REVOLUTX_API_URL}/orders?${queryString}`
    : `${REVOLUTX_API_URL}/orders`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        ...getAuthHeaders("GET", "/api/1.0/orders", "", queryString),
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
    return handleAxiosError(error, "fetching active orders");
  }
}
