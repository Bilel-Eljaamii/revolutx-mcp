import axios from "axios";
import { 
  handleGetBalances 
} from "../../src/tools/balance/get_balances";
import { 
  handleGetCurrencies 
} from "../../src/tools/configuration/get_currencies";
import { 
  handleGetPairs 
} from "../../src/tools/configuration/get_pairs";
import { 
  handleGetActiveOrders 
} from "../../src/tools/orders/get_active_orders";
import { 
  handleGetHistoricalOrders 
} from "../../src/tools/orders/get_historical_orders";
import { 
  handleGetOrderFills 
} from "../../src/tools/orders/get_order_fills";
import { 
  handlePlaceOrder 
} from "../../src/tools/orders/place_order";
import { 
  handleCancelOrder 
} from "../../src/tools/orders/cancel_order_by_id";
import { 
  handleCancelAllOrders 
} from "../../src/tools/orders/cancel_all_orders";
import { 
  handleGetOrder 
} from "../../src/tools/orders/get_order_by_id";
import { 
  handleGetAllTrades 
} from "../../src/tools/trades/get_all_trades";
import { 
  handleGetPrivateTrades 
} from "../../src/tools/trades/get_private_trades";
import { 
  handleGetOrderBookSnapshot 
} from "../../src/tools/market_data/get_order_book_snapshot";
import { 
  handleGetCandles 
} from "../../src/tools/market_data/get_candles";
import { 
  handleGetTickers 
} from "../../src/tools/market_data/get_tickers";
import { 
  handleGetLastTrades 
} from "../../src/tools/public_market_data/get_last_trades";
import { 
  handleGetOrderBook 
} from "../../src/tools/public_market_data/get_order_book";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock utils.ts
jest.mock("../../src/utils", () => ({
  __esModule: true,
  ...jest.requireActual("../../src/utils"),
  checkApiKey: jest.fn().mockReturnValue(null),
  getAuthHeaders: jest.fn().mockReturnValue({ "X-Sign": "mock" }),
  handleAxiosError: jest.fn().mockImplementation((err, context) => ({
    content: [{ type: "text", text: `Error ${context}: ${err.message || 'unknown'}` }],
    isError: true
  }))
}));

import { checkApiKey } from "../../src/utils";

describe("RevolutX Tool Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkApiKey as jest.Mock).mockReturnValue(null);
  });

  test("handleGetBalances returns balances", async () => {
    const mockData = [{ currency: "BTC", available: "1.0" }];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await handleGetBalances();
    expect((result as any).isError).toBeUndefined();
    expect(result.content[0].text).toContain("BTC");
  });

  test("handlePlaceOrder places a market order", async () => {
    const mockData = { id: "ord_123", status: "filled" };
    mockedAxios.post.mockResolvedValueOnce({ data: mockData });

    const result = await handlePlaceOrder({
      symbol: "BTC-USD",
      side: "buy",
      type: "market",
      quantity: "0.1"
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/orders"),
      expect.stringContaining("client_order_id"),
      expect.any(Object)
    );
    expect(result.content[0].text).toContain("ord_123");
  });

  test("handleCancelOrder cancels an order", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ status: 204 });

    const result = await handleCancelOrder({ order_id: "ord_123" });
    expect(result.content[0].text).toContain("cancelled successfully");
  });

  test("handleGetTickers fetches tickers", async () => {
    const mockData = { "BTC-USD": { last_price: "50000" } };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await handleGetTickers({ symbols: "BTC-USD" });
    expect(result.content[0].text).toContain("50000");
  });

  test("handleGetOrderBook fetches public order book", async () => {
    const mockData = { data: { asks: [], bids: [] } };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await handleGetOrderBook({ symbol: "BTC-USD" });
    expect(result.content[0].text).toContain("asks");
  });

  test("handleGetCandles fetches historical candles", async () => {
    const mockData = [{ t: 123, o: "1", h: "2", l: "0.5", c: "1.5", v: "10" }];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await handleGetCandles({ symbol: "BTC-USD", interval: 60 });
    expect(result.content[0].text).toContain("1.5");
  });

  test("handleGetHistoricalOrders fetches order history", async () => {
    const mockData = { data: [] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await handleGetHistoricalOrders({ limit: 10 });
    expect(result.content[0].text).toContain("[]");
  });

  test("handleGetPrivateTrades fetches private trades", async () => {
    const mockData = { data: [] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const result = await handleGetPrivateTrades({ symbol: "ETH-USD" });
    expect(result.content[0].text).toContain("[]");
  });

  test("error handling in tools", async () => {
    const axiosError = new Error("Request failed");
    (axiosError as any).isAxiosError = true;
    (axiosError as any).response = { status: 401, data: { message: "Auth failed" } };
    
    mockedAxios.get.mockRejectedValueOnce(axiosError);

    const result = await handleGetBalances();
    expect((result as any).isError).toBe(true);
    expect(result.content[0].text).toContain("Error fetching balances");
  });

  test("checkApiKey blocking tool execution", async () => {
    (checkApiKey as jest.Mock).mockReturnValueOnce({
      content: [{ type: "text", text: "API Key missing" }],
      isError: true
    });

    const result = await handleGetBalances();
    expect((result as any).isError).toBe(true);
    expect(result.content[0].text).toBe("API Key missing");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });
});
