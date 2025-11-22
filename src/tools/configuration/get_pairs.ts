import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, API_KEY, handleAxiosError, checkApiKey } from "../../utils.js";

export const getPairsTool: Tool = {
    name: "get_pairs",
    description: "Get configuration for all traded currency pairs. Requires REVOLUTX_API_KEY.",
    inputSchema: {
        type: "object",
        properties: {},
    },
};

export async function handleGetPairs() {
    const apiKeyError = checkApiKey();
    if (apiKeyError) return apiKeyError;

    try {
        const response = await axios.get(`${REVOLUTX_API_URL}/configuration/pairs`, {
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
        return handleAxiosError(error, "fetching pairs");
    }
}
