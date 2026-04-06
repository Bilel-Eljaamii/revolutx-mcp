import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
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

const server = new McpServer({
  name: "revolutx-mcp",
  version: "0.1.0",
});

// Register all tools
const toolDefinitions = [
  { tool: getBalancesTool, handler: handleGetBalances },
  { tool: getCurrenciesTool, handler: handleGetCurrencies },
  { tool: getPairsTool, handler: handleGetPairs },
  {
    tool: getActiveOrdersTool,
    handler: (args) => handleGetActiveOrders(args),
  },
  {
    tool: getHistoricalOrdersTool,
    handler: (args) => handleGetHistoricalOrders(args),
  },
  {
    tool: getOrderFillsTool,
    handler: (args) => handleGetOrderFills(args),
  },
  { tool: getLastTradesTool, handler: handleGetLastTrades },
  { tool: getOrderBookTool, handler: (args) => handleGetOrderBook(args) },
  { tool: placeOrderTool, handler: (args) => handlePlaceOrder(args) },
  { tool: cancelOrderTool, handler: (args) => handleCancelOrder(args) },
  { tool: cancelAllOrdersTool, handler: handleCancelAllOrders },
  { tool: getOrderTool, handler: (args) => handleGetOrder(args) },
  { tool: getAllTradesTool, handler: (args) => handleGetAllTrades(args) },
  {
    tool: getPrivateTradesTool,
    handler: (args) => handleGetPrivateTrades(args),
  },
  {
    tool: getOrderBookSnapshotTool,
    handler: (args) => handleGetOrderBookSnapshot(args),
  },
  { tool: getCandlesTool, handler: (args) => handleGetCandles(args) },
  { tool: getTickersTool, handler: (args) => handleGetTickers(args) },
];

for (const { tool, handler } of toolDefinitions) {
  server.registerTool(
    tool.name,
    tool.description ?? "",
    tool.inputSchema.properties ?? {},
    handler,
  );
}

// Register resources
for (const resource of resources) {
  server.registerResource(resource.name, resource.uri, async (uri) =>
    handleReadResource(String(uri)),
  );
}

// Register prompts
for (const prompt of prompts) {
  server.registerPrompt(prompt.name, prompt.arguments ?? [], (args) =>
    handleGetPrompt(prompt.name, args),
  );
}

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("RevolutX MCP Server running on stdio");
}

runServer().catch((error: unknown) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
