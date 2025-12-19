import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  API_KEY,
  handleAxiosError,
  checkApiKey,
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
    },
  },
};

export async function handleGetActiveOrders(args: any) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const cursor = args?.cursor as string | undefined;
  const limit = args?.limit as number | undefined;

  try {
    const response = await axios.get(`${REVOLUTX_API_URL}/orders`, {
      headers: {
        Accept: "application/json",
        "X-API-KEY": API_KEY,
      },
      params: {
        cursor,
        limit,
      },
      validateStatus: (status) => true,
    });

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

    return handleAxiosError({ response }, "fetching active orders");
  } catch (error: any) {
    return handleAxiosError(error, "fetching active orders");
  }
}
