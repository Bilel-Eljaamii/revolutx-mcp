import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import {
  REVOLUTX_API_URL,
  handleAxiosError,
  checkApiKey,
  getAuthHeaders,
} from "../../utils.js";

export const cancelAllOrdersTool: Tool = {
  name: "cancel_all_orders",
  description:
    "Cancel all active limit, conditional, and Take Profit/Stop Loss (TPSL) orders.",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export async function handleCancelAllOrders() {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  try {
    const _response = await axios.delete(`${REVOLUTX_API_URL}/orders`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeaders("DELETE", "/api/1.0/orders"),
      },
    });

    return {
      content: [
        {
          type: "text",
          text: "All active orders cancelled successfully.",
        },
      ],
    };
  } catch (error: unknown) {
    return handleAxiosError(error, "canceling all orders");
  }
}
