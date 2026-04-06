import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  handleAxiosError,
  checkApiKey,
  getAuthHeaders,
} from "../../utils.js";

export const getOrderTool: Tool = {
  name: "get_order",
  description: "Get details of a specific order by its ID.",
  inputSchema: {
    type: "object",
    properties: {
      order_id: {
        type: "string",
        description: "The ID of the order to retrieve",
      },
    },
    required: ["order_id"],
  },
};

interface GetOrderArgs {
  order_id: string;
}

export async function handleGetOrder(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { order_id } = args as GetOrderArgs;

  try {
    const path = `/api/1.0/orders/${order_id}`;
    const response = await axios.get(`${REVOLUTX_API_URL}/orders/${order_id}`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeaders("GET", path),
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
    return handleAxiosError(error, `fetching order ${order_id}`);
  }
}
