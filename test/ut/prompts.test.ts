import { handleGetPrompt } from "../../src/prompts/index";

describe("RevolutX MCP Prompts", () => {
    test("analyze-market returns correct prompt", () => {
        const result = handleGetPrompt("analyze-market", { symbol: "BTC-USD" });
        expect(result.messages[0].content.text).toContain("analyze the market for BTC-USD");
    });

    test("analyze-market throws if symbol missing", () => {
        expect(() => handleGetPrompt("analyze-market", {})).toThrow("Argument 'symbol' is required");
    });

    test("create-ladder-strategy returns correct prompt with all args", () => {
        const args = {
            symbol: "ETH-USD",
            start_price: "2000",
            end_price: "1800",
            num_levels: "5",
            total_quantity: "10",
            side: "buy"
        };
        const result = handleGetPrompt("create-ladder-strategy", args);
        expect(result.messages[0].content.text).toContain("ladder strategy for buying ETH-USD");
        expect(result.messages[0].content.text).toContain("Start Price: 2000");
    });

    test("create-ladder-strategy throws if args missing", () => {
        expect(() => handleGetPrompt("create-ladder-strategy", { symbol: "BTC-USD" }))
            .toThrow("Missing required arguments");
    });

    test("portfolio-summary returns correct prompt", () => {
        const result = handleGetPrompt("portfolio-summary", { currency: "EUR" });
        expect(result.messages[0].content.text).toContain("portfolio summary in EUR");
    });

    test("portfolio-summary use default currency", () => {
        const result = handleGetPrompt("portfolio-summary", {});
        expect(result.messages[0].content.text).toContain("portfolio summary in USD");
    });

    test("risk-assessment returns correct prompt", () => {
        const result = handleGetPrompt("risk-assessment", { currency: "GBP" });
        expect(result.messages[0].content.text).toContain("risk assessment of my portfolio in GBP");
    });

    test("order-management returns correct prompt", () => {
        const result = handleGetPrompt("order-management", {});
        expect(result.messages[0].content.text).toContain("help me manage my active orders");
    });

    test("market-comparison returns correct prompt", () => {
        const result = handleGetPrompt("market-comparison", { symbols: "BTC-USD, ETH-USD" });
        expect(result.messages[0].content.text).toContain("compare market conditions for: BTC-USD, ETH-USD");
    });

    test("market-comparison throws if symbols missing", () => {
        expect(() => handleGetPrompt("market-comparison", {})).toThrow("Argument 'symbols' is required");
    });

    test("price-alert-setup returns correct prompt", () => {
        const args = { symbol: "BTC-USD", target_price: "50000", direction: "above" };
        const result = handleGetPrompt("price-alert-setup", args);
        expect(result.messages[0].content.text).toContain("price monitoring for BTC-USD at 50000");
    });

    test("throws for unknown prompt", () => {
        expect(() => handleGetPrompt("unknown-prompt", {})).toThrow("Prompt not found");
    });
});
