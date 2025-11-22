import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, handleAxiosError } from "../../utils.js";

interface Trade {
    tdt: string; // Trade date time
    aid: string; // Asset ID
    anm: string; // Asset name
    p: string;   // Price
    pc: string;  // Price currency
    pn: string;  // Price name
    q: string;   // Quantity
    qc: string;  // Quantity currency
    qn: string;  // Quantity name
    ve: string;  // Venue
    pdt: string; // Processed date time
    vp: string;  // Venue processed
    tid: string; // Trade ID
}

interface TradeResponse {
    data: Trade[];
    metadata: {
        timestamp: string;
    };
}

export const getLastTradesTool: Tool = {
    name: "get_last_trades",
    description: "Get the list of the latest 100 trades executed on Revolut X crypto exchange.",
    inputSchema: {
        type: "object",
        properties: {},
    },
};

export async function handleGetLastTrades() {
    try {
        const response = await axios.get<TradeResponse>(`${REVOLUTX_API_URL}/public/last-trades`, {
            headers: {
                "Accept": "application/json",
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
        return handleAxiosError(error, "fetching last trades");
    }
}
