import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, API_KEY, handleAxiosError, checkApiKey } from "../../utils.js";

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

export async function handleGetOrder(args: any) {
    const apiKeyError = checkApiKey();
    if (apiKeyError) return apiKeyError;

    const { order_id } = args;

    try {
        const response = await axios.get(`${REVOLUTX_API_URL}/orders/${order_id}`, {
            headers: {
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
        return handleAxiosError(error, `fetching order ${order_id}`);
    }
}
