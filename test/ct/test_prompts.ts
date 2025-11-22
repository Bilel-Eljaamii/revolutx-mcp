import { handleGetPrompt } from "../../src/prompts/index.js";

async function testPrompts() {
    console.log("Testing Prompts...");

    try {
        console.log("Testing analyze-market...");
        const analyze = await handleGetPrompt("analyze-market", { symbol: "BTC-USD" });
        if (!analyze.messages[0].content.text.includes("BTC-USD")) throw new Error("analyze-market failed");
        console.log("analyze-market OK");

        console.log("Testing create-ladder-strategy...");
        const ladder = await handleGetPrompt("create-ladder-strategy", {
            symbol: "ETH-USD", start_price: "100", end_price: "200", num_levels: "3", total_quantity: "1", side: "sell"
        });
        if (!ladder.messages[0].content.text.includes("selling ETH-USD")) throw new Error("create-ladder-strategy failed");
        console.log("create-ladder-strategy OK");

        console.log("Testing portfolio-summary...");
        const portfolio = await handleGetPrompt("portfolio-summary", { currency: "GBP" });
        if (!portfolio.messages[0].content.text.includes("summary in GBP")) throw new Error("portfolio-summary failed");
        console.log("portfolio-summary OK");

    } catch (error: any) {
        console.error("Error testing prompts:", error.message);
        process.exit(1);
    }
}

testPrompts();
