import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  getAuthHeaders,
  handleAxiosError,
  checkApiKey,
} from "../../utils.js";

export const getOrderFillsTool: Tool = {
  name: "get_order_fills",
  description:
    "Retrieves the fills (trades) associated with a specific order belonging to the client.",
  inputSchema: {
    type: "object",
    properties: {
      order_id: {
        type: "string",
        description: "Unique identifier (UUID) of the venue order",
      },
    },
    required: ["order_id"],
  },
};

interface GetOrderFillsArgs {
  order_id: string;
}

export async function handleGetOrderFills(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { order_id } = args as GetOrderFillsArgs;

  try {
    const path = `/api/1.0/orders/fills/${order_id}`;
    const response = await axios.get(
      `${REVOLUTX_API_URL}/orders/fills/${order_id}`,
      {
        headers: {
          Accept: "application/json",
          ...getAuthHeaders("GET", path),
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
    return handleAxiosError(error, `fetching fills for order ${order_id}`);
  }
}
