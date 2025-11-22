import { Resource } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, API_KEY } from "../utils.js";

export const resources: Resource[] = [
    {
        uri: "revolutx://pairs",
        name: "Currency Pairs",
        description: "List of all available currency pairs and their configuration.",
        mimeType: "application/json",
    },
];

export async function handleReadResource(uri: string) {
    if (uri === "revolutx://pairs") {
        if (!API_KEY) {
            throw new Error("REVOLUTX_API_KEY is required to read this resource.");
        }
        try {
            const response = await axios.get(`${REVOLUTX_API_URL}/configuration/pairs`, {
                headers: {
                    "Accept": "application/json",
                    "X-API-KEY": API_KEY,
                },
            });
            return {
                contents: [
                    {
                        uri: uri,
                        mimeType: "application/json",
                        text: JSON.stringify(response.data, null, 2),
                    },
                ],
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch pairs: ${error.message}`);
        }
    }
    throw new Error(`Resource not found: ${uri}`);
}
