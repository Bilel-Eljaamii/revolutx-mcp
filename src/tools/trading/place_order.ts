import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, API_KEY, handleAxiosError, checkApiKey } from "../../utils.js";

export const placeOrderTool: Tool = {
    name: "place_order",
    description: "Place a new order on the exchange. WARNING: This performs a real financial transaction.",
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

export async function handlePlaceOrder(args: any) {
    const apiKeyError = checkApiKey();
    if (apiKeyError) return apiKeyError;

    const { symbol, side, type, quantity, price } = args;

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

    const orderData: any = {
        symbol,
        side,
        type,
        quantity,
    };

    if (price) {
        orderData.price = price;
    }

    try {
        const response = await axios.post(`${REVOLUTX_API_URL}/orders`, orderData, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-API-KEY": API_KEY,
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
    } catch (error: any) {
        return handleAxiosError(error, "placing order");
    }
}
