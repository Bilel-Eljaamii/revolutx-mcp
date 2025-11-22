import { handleGetPrompt } from "../../src/prompts/index";

describe("RevolutX MCP Prompts", () => {
    test("analyze-market returns correct prompt", async () => {
        const result = await handleGetPrompt("analyze-market", { symbol: "BTC-USD" });
        expect(result.messages[0].content.text).toContain("analyze the market for BTC-USD");
    });

    test("analyze-market throws if symbol missing", async () => {
        await expect(handleGetPrompt("analyze-market", {})).rejects.toThrow("Argument 'symbol' is required");
    });

    test("create-ladder-strategy returns correct prompt", async () => {
        const args = {
            symbol: "ETH-USD",
            start_price: "2000",
            end_price: "1800",
            num_levels: "5",
            total_quantity: "10",
            side: "buy"
        };
        const result = await handleGetPrompt("create-ladder-strategy", args);
        expect(result.messages[0].content.text).toContain("ladder strategy for buying ETH-USD");
        expect(result.messages[0].content.text).toContain("Start Price: 2000");
    });

    test("portfolio-summary returns correct prompt", async () => {
        const result = await handleGetPrompt("portfolio-summary", { currency: "EUR" });
        expect(result.messages[0].content.text).toContain("portfolio summary in EUR");
    });

    test("risk-assessment returns correct prompt", async () => {
        const result = await handleGetPrompt("risk-assessment", { currency: "USD" });
        expect(result.messages[0].content.text).toContain("risk assessment of my portfolio in USD");
        expect(result.messages[0].content.text).toContain("get_balances");
        expect(result.messages[0].content.text).toContain("get_active_orders");
        expect(result.messages[0].content.text).toContain("Portfolio concentration");
    });

    test("risk-assessment uses default currency", async () => {
        const result = await handleGetPrompt("risk-assessment", {});
        expect(result.messages[0].content.text).toContain("USD");
    });

    test("order-management returns correct prompt", async () => {
        const result = await handleGetPrompt("order-management", {});
        expect(result.messages[0].content.text).toContain("manage my active orders");
        expect(result.messages[0].content.text).toContain("get_active_orders");
        expect(result.messages[0].content.text).toContain("get_order_book");
        expect(result.messages[0].content.text).toContain("cancel_order");
    });

    test("market-comparison returns correct prompt", async () => {
        const result = await handleGetPrompt("market-comparison", { symbols: "BTC-USD,ETH-USD,SOL-USD" });
        expect(result.messages[0].content.text).toContain("BTC-USD, ETH-USD, SOL-USD");
        expect(result.messages[0].content.text).toContain("get_order_book");
        expect(result.messages[0].content.text).toContain("get_last_trades");
        expect(result.messages[0].content.text).toContain("comparison table");
    });

    test("market-comparison throws if symbols missing", async () => {
        await expect(handleGetPrompt("market-comparison", {})).rejects.toThrow("Argument 'symbols' is required");
    });

    test("price-alert-setup returns correct prompt", async () => {
        const result = await handleGetPrompt("price-alert-setup", {
            symbol: "BTC-USD",
            target_price: "50000",
            direction: "below"
        });
        expect(result.messages[0].content.text).toContain("price monitoring for BTC-USD at 50000");
        expect(result.messages[0].content.text).toContain("alert when price goes below");
        expect(result.messages[0].content.text).toContain("get_order_book");
    });

    test("price-alert-setup uses default direction", async () => {
        const result = await handleGetPrompt("price-alert-setup", {
            symbol: "ETH-USD",
            target_price: "3000"
        });
        expect(result.messages[0].content.text).toContain("alert when price goes above");
    });

    test("price-alert-setup throws if symbol missing", async () => {
        await expect(handleGetPrompt("price-alert-setup", { target_price: "50000" }))
            .rejects.toThrow("Argument 'symbol' is required");
    });

    test("price-alert-setup throws if target_price missing", async () => {
        await expect(handleGetPrompt("price-alert-setup", { symbol: "BTC-USD" }))
            .rejects.toThrow("Argument 'target_price' is required");
    });

    test("throws error for unknown prompt", async () => {
        await expect(handleGetPrompt("unknown-prompt", {})).rejects.toThrow("Prompt not found");
    });
});
