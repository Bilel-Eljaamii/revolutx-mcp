import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  handleAxiosError,
  checkApiKey,
  getAuthHeaders,
} from "../../utils.js";

export const cancelOrderTool: Tool = {
  name: "cancel_order",
  description: "Cancel an active order by its ID.",
  inputSchema: {
    type: "object",
    properties: {
      order_id: {
        type: "string",
        description: "The ID of the order to cancel",
      },
    },
    required: ["order_id"],
  },
};

interface CancelOrderArgs {
  order_id: string;
}

export async function handleCancelOrder(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { order_id } = args as CancelOrderArgs;

  try {
    // Note: RevolutX API typically uses DELETE /orders/{id}
    const path = `/api/1.0/orders/${order_id}`;
    const response = await axios.delete(
      `${REVOLUTX_API_URL}/orders/${order_id}`,
      {
        headers: {
          Accept: "application/json",
          ...getAuthHeaders("DELETE", path),
        },
      },
    );

    return {
      content: [
        {
          type: "text",
          text: "Order cancelled successfully.",
        },
      ],
    };
  } catch (error: unknown) {
    return handleAxiosError(error, `canceling order ${order_id}`);
  }
}
