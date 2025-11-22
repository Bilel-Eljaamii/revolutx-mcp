import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, API_KEY, handleAxiosError, checkApiKey } from "../../utils.js";

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

export async function handleCancelOrder(args: any) {
    const apiKeyError = checkApiKey();
    if (apiKeyError) return apiKeyError;

    const { order_id } = args;

    try {
        // Note: RevolutX API typically uses DELETE /orders/{id}
        const response = await axios.delete(`${REVOLUTX_API_URL}/orders/${order_id}`, {
            headers: {
                "Accept": "application/json",
                "X-API-KEY": API_KEY,
            },
        });

        return {
            content: [
                {
                    type: "text",
                    text: response.status === 204 ? "Order cancelled successfully." : JSON.stringify(response.data, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return handleAxiosError(error, `canceling order ${order_id}`);
    }
}
