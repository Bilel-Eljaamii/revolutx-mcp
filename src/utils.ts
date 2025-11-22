import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";
export const API_KEY = process.env.REVOLUTX_API_KEY;

export function handleAxiosError(error: any, context: string) {
    let errorMessage = `Error ${context}: ${error.message}`;
    if (axios.isAxiosError(error) && error.response) {
        errorMessage += ` (Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)})`;
    }
    return {
        content: [
            {
                type: "text",
                text: errorMessage,
            },
        ],
        isError: true,
    };
}

export function checkApiKey() {
    if (!API_KEY) {
        return {
            content: [
                {
                    type: "text",
                    text: "Error: REVOLUTX_API_KEY environment variable is required for this tool.",
                },
            ],
            isError: true,
        };
    }
    return null;
}
