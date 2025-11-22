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

    test("throws error for unknown prompt", async () => {
        await expect(handleGetPrompt("unknown-prompt", {})).rejects.toThrow("Prompt not found");
    });
});
