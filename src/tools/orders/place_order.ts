import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import crypto from "crypto";
import {
  REVOLUTX_API_URL,
  handleAxiosError,
  checkApiKey,
  getAuthHeaders,
} from "../../utils.js";

export const placeOrderTool: Tool = {
  name: "place_order",
  description:
    "Place a new order on the exchange. WARNING: This performs a real financial transaction.",
  inputSchema: {
    type: "object",
    properties: {
      symbol: {
        type: "string",
        description: "The trading pair symbol (e.g., BTC-USD)",
      },
      side: {
        type: "string",
        enum: ["buy", "sell"],
        description: "Side of the order (buy or sell)",
      },
      type: {
        type: "string",
        enum: ["market", "limit"],
        description: "Type of the order (market or limit)",
      },
      quantity: {
        type: "string",
        description: "Quantity to buy or sell",
      },
      price: {
        type: "string",
        description: "Price for limit orders (required if type is limit)",
      },
    },
    required: ["symbol", "side", "type", "quantity"],
  },
};

interface PlaceOrderArgs {
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit";
  quantity: string;
  price?: string;
}

export async function handlePlaceOrder(args: unknown) {
  const apiKeyError = checkApiKey();
  if (apiKeyError) return apiKeyError;

  const { symbol, side, type, quantity, price } = args as PlaceOrderArgs;

  if (type === "limit" && !price) {
    return {
      content: [
        {
          type: "text",
          text: "Error: Price is required for limit orders.",
        },
      ],
      isError: true,
    };
  }

  const orderData: Record<string, unknown> = {
    client_order_id: crypto.randomUUID(),
    symbol,
    side,
  };

  if (type === "limit") {
    orderData.limit = {
      base_size: quantity,
      price: price,
    };
  } else {
    orderData.market = {
      base_size: quantity,
    };
  }

  try {
    const bodyString = JSON.stringify(orderData);
    const response = await axios.post(
      `${REVOLUTX_API_URL}/orders`,
      bodyString,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeaders("POST", "/api/1.0/orders", bodyString),
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
    return handleAxiosError(error, "placing order");
  }
}
