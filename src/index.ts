import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";

// Import tools
import { getBalancesTool, handleGetBalances } from "./tools/balance/get_balances.js";
import { getCurrenciesTool, handleGetCurrencies } from "./tools/configuration/get_currencies.js";
import { getPairsTool, handleGetPairs } from "./tools/configuration/get_pairs.js";
import { getActiveOrdersTool, handleGetActiveOrders } from "./tools/orders/get_active_orders.js";
import { getLastTradesTool, handleGetLastTrades } from "./tools/public_market_data/get_last_trades.js";
import { getOrderBookTool, handleGetOrderBook } from "./tools/public_market_data/get_order_book.js";
import { placeOrderTool, handlePlaceOrder } from "./tools/trading/place_order.js";
import { cancelOrderTool, handleCancelOrder } from "./tools/trading/cancel_order.js";
import { getOrderTool, handleGetOrder } from "./tools/trading/get_order.js";

// Import resources and prompts
import { resources, handleReadResource } from "./resources/index.js";
import { prompts, handleGetPrompt } from "./prompts/index.js";

dotenv.config();

const server = new Server(
    {
        name: "revolutx-mcp",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
            resources: {},
            prompts: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            getBalancesTool,
            getCurrenciesTool,
            getPairsTool,
            getActiveOrdersTool,
            getLastTradesTool,
            getOrderBookTool,
            placeOrderTool,
            cancelOrderTool,
            getOrderTool,
        ],
    };
});

server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: resources,
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return handleReadResource(request.params.uri);
});

server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: prompts,
    };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    return handleGetPrompt(request.params.name, request.params.arguments);
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "get_balances":
            return handleGetBalances();
        case "get_currencies":
            return handleGetCurrencies();
        case "get_pairs":
            return handleGetPairs();
        case "get_active_orders":
            return handleGetActiveOrders(request.params.arguments);
        case "get_last_trades":
            return handleGetLastTrades();
        case "get_order_book":
            return handleGetOrderBook(request.params.arguments);
        case "place_order":
            return handlePlaceOrder(request.params.arguments);
        case "cancel_order":
            return handleCancelOrder(request.params.arguments);
        case "get_order":
            return handleGetOrder(request.params.arguments);
        default:
            throw new Error(`Tool not found: ${request.params.name}`);
    }
});

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("RevolutX MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
});

