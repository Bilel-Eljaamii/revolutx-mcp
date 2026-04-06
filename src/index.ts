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
import {
  getBalancesTool,
  handleGetBalances,
} from "./tools/balance/get_balances.js";
import {
  getCurrenciesTool,
  handleGetCurrencies,
} from "./tools/configuration/get_currencies.js";
import {
  getPairsTool,
  handleGetPairs,
} from "./tools/configuration/get_pairs.js";
import {
  getActiveOrdersTool,
  handleGetActiveOrders,
} from "./tools/orders/get_active_orders.js";
import {
  getHistoricalOrdersTool,
  handleGetHistoricalOrders,
} from "./tools/orders/get_historical_orders.js";
import {
  getOrderFillsTool,
  handleGetOrderFills,
} from "./tools/orders/get_order_fills.js";
import {
  getLastTradesTool,
  handleGetLastTrades,
} from "./tools/public_market_data/get_last_trades.js";
import {
  getOrderBookTool,
  handleGetOrderBook,
} from "./tools/public_market_data/get_order_book.js";
import {
  placeOrderTool,
  handlePlaceOrder,
} from "./tools/orders/place_order.js";
import {
  cancelOrderTool,
  handleCancelOrder,
} from "./tools/orders/cancel_order_by_id.js";
import {
  cancelAllOrdersTool,
  handleCancelAllOrders,
} from "./tools/orders/cancel_all_orders.js";
import {
  getOrderTool,
  handleGetOrder,
} from "./tools/orders/get_order_by_id.js";
import {
  getAllTradesTool,
  handleGetAllTrades,
} from "./tools/trades/get_all_trades.js";
import {
  getPrivateTradesTool,
  handleGetPrivateTrades,
} from "./tools/trades/get_private_trades.js";
import {
  getOrderBookSnapshotTool,
  handleGetOrderBookSnapshot,
} from "./tools/market_data/get_order_book_snapshot.js";
import {
  getCandlesTool,
  handleGetCandles,
} from "./tools/market_data/get_candles.js";
import {
  getTickersTool,
  handleGetTickers,
} from "./tools/market_data/get_tickers.js";

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
  },
);

server.setRequestHandler(ListToolsRequestSchema, () => {
  return {
    tools: [
      getBalancesTool,
      getCurrenciesTool,
      getPairsTool,
      getActiveOrdersTool,
      getHistoricalOrdersTool,
      getOrderFillsTool,
      getLastTradesTool,
      getOrderBookTool,
      placeOrderTool,
      cancelOrderTool,
      cancelAllOrdersTool,
      getOrderTool,
      getAllTradesTool,
      getPrivateTradesTool,
      getOrderBookSnapshotTool,
      getCandlesTool,
      getTickersTool,
    ],
  };
});

server.setRequestHandler(ListResourcesRequestSchema, () => {
  return {
    resources: resources,
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  return handleReadResource(request.params.uri);
});

server.setRequestHandler(ListPromptsRequestSchema, () => {
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
    case "get_historical_orders":
      return handleGetHistoricalOrders(request.params.arguments);
    case "get_last_trades":
      return handleGetLastTrades();
    case "get_order_book":
      return handleGetOrderBook(request.params.arguments);
    case "place_order":
      return handlePlaceOrder(request.params.arguments);
    case "cancel_order":
      return handleCancelOrder(request.params.arguments);
    case "cancel_all_orders":
      return handleCancelAllOrders();
    case "get_order":
      return handleGetOrder(request.params.arguments);
    case "get_order_fills":
      return handleGetOrderFills(request.params.arguments);
    case "get_all_trades":
      return handleGetAllTrades(request.params.arguments);
    case "get_private_trades":
      return handleGetPrivateTrades(request.params.arguments);
    case "get_order_book_snapshot":
      return handleGetOrderBookSnapshot(request.params.arguments);
    case "get_candles":
      return handleGetCandles(request.params.arguments);
    case "get_tickers":
      return handleGetTickers(request.params.arguments);
    default:
      throw new Error(`Tool not found: ${request.params.name}`);
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RevolutX MCP Server running on stdio");
}

runServer().catch((error: unknown) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
