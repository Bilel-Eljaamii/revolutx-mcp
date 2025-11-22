import { Prompt } from "@modelcontextprotocol/sdk/types.js";

export const prompts: Prompt[] = [
    {
        name: "analyze-market",
        description: "Analyze the market conditions for a specific trading pair.",
        arguments: [
            {
                name: "symbol",
                description: "The trading pair symbol (e.g., BTC-USD)",
                required: true,
            },
        ],
    },
    {
        name: "create-ladder-strategy",
        description: "Generate a ladder trading strategy (multiple orders at different price levels).",
        arguments: [
            {
                name: "symbol",
                description: "Trading pair symbol (e.g., BTC-USD)",
                required: true,
            },
            {
                name: "start_price",
                description: "Starting price for the ladder",
                required: true,
            },
            {
                name: "end_price",
                description: "Ending price for the ladder",
                required: true,
            },
            {
                name: "num_levels",
                description: "Number of price levels",
                required: true,
            },
            {
                name: "total_quantity",
                description: "Total quantity to distribute across levels",
                required: true,
            },
            {
                name: "side",
                description: "buy or sell",
                required: true,
            },
        ],
    },
    {
        name: "portfolio-summary",
        description: "Analyze current portfolio value based on balances and market prices.",
        arguments: [
            {
                name: "currency",
                description: "Target currency to value portfolio in (default: USD)",
                required: false,
            },
        ],
    },
];

export async function handleGetPrompt(name: string, args: any) {
    if (name === "analyze-market") {
        const symbol = args?.symbol;
        if (!symbol) {
            throw new Error("Argument 'symbol' is required");
        }
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please analyze the market for ${symbol}. 
1. Use the 'get_last_trades' tool to see recent activity.
2. Use the 'get_order_book' tool for ${symbol} to check liquidity and spread.
3. Summarize the current sentiment (bullish/bearish/neutral) and key price levels.`,
                    },
                },
            ],
        };
    }

    if (name === "create-ladder-strategy") {
        const { symbol, start_price, end_price, num_levels, total_quantity, side } = args;
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to create a ladder strategy for ${side}ing ${symbol}.
Parameters:
- Start Price: ${start_price}
- End Price: ${end_price}
- Levels: ${num_levels}
- Total Quantity: ${total_quantity}

Please:
1. Calculate the price levels and quantity per level (linear distribution).
2. Show me the plan.
3. Ask for confirmation before using 'place_order' for each level.`,
                    },
                },
            ],
        };
    }

    if (name === "portfolio-summary") {
        const currency = args?.currency || "USD";
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please generate a portfolio summary in ${currency}.
1. Call 'get_balances' to see what assets I hold.
2. For each non-zero asset (excluding ${currency}), call 'get_last_trades' or 'get_order_book' for the relevant pair (e.g., BTC-${currency}) to get the current price.
3. Calculate the total value of my holdings.`,
                    },
                },
            ],
        };
    }

    throw new Error(`Prompt not found: ${name}`);
}
