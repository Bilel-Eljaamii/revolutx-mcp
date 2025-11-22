import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, API_KEY, handleAxiosError, checkApiKey } from "../../utils.js";

export const getCurrenciesTool: Tool = {
    name: "get_currencies",
    description: "Get configuration for all currencies used on the exchange. Requires REVOLUTX_API_KEY.",
    inputSchema: {
        type: "object",
        properties: {},
    },
};

export async function handleGetCurrencies() {
    const apiKeyError = checkApiKey();
    if (apiKeyError) return apiKeyError;

    try {
        const response = await axios.get(`${REVOLUTX_API_URL}/configuration/currencies`, {
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
        return handleAxiosError(error, "fetching currencies");
    }
}
