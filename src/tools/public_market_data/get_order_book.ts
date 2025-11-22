import { Tool } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { REVOLUTX_API_URL, handleAxiosError } from "../../utils.js";

interface OrderBookEntry {
    aid: string; // Asset ID
    anm: string; // Asset name
    s: string;   // Side (BUYI/SELL)
    p: string;   // Price
    pc: string;  // Price currency
    pn: string;  // Price name
    q: string;   // Quantity
    qc: string;  // Quantity currency
    qn: string;  // Quantity name
    ve: string;  // Venue
    no: string;  // Number of orders? (from example)
    ts: string;  // Timestamp source?
    pdt: string; // Processed date time
}

interface OrderBookResponse {
    data: {
        asks: OrderBookEntry[];
        bids: OrderBookEntry[];
    };
    metadata: {
        timestamp: string;
    };
}

export const getOrderBookTool: Tool = {
    name: "get_order_book",
    description: "Fetch the current order book (bids and asks) for a given trading pair (with a maximum of 5 price levels).",
    inputSchema: {
        type: "object",
        properties: {
            symbol: {
                type: "string",
                description: "The trading pair symbol (e.g., BTC-USD)",
            },
        },
        required: ["symbol"],
    },
};

export async function handleGetOrderBook(args: any) {
    const symbol = args?.symbol as string;
    if (!symbol) {
        throw new Error("Symbol is required");
    }

    try {
        const response = await axios.get<OrderBookResponse>(`${REVOLUTX_API_URL}/public/order-book/${symbol}`, {
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
        return handleAxiosError(error, `fetching order book for ${symbol}`);
    }
}
