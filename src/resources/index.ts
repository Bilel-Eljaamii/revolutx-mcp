import { Resource } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, getAuthHeaders, checkApiKey } from "../utils.js";

export const resources: Resource[] = [
  {
    uri: "revolutx://pairs",
    name: "Currency Pairs",
    description:
      "List of all available currency pairs and their configuration.",
    mimeType: "application/json",
  },
];

export async function handleReadResource(uri: string) {
  if (uri === "revolutx://pairs") {
    const apiError = checkApiKey();
    if (apiError) {
      throw new Error(apiError.content[0].text);
    }

    try {
      const path = "/api/1.0/configuration/pairs";
      const response = await axios.get(
        `${REVOLUTX_API_URL}/configuration/pairs`,
        {
          headers: {
            Accept: "application/json",
            ...getAuthHeaders("GET", path),
          },
        },
      );
      return {
        contents: [
          {
            uri: uri,
            mimeType: "application/json",
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch pairs: ${message}`);
    }
  }
  throw new Error(`Resource not found: ${uri}`);
}
