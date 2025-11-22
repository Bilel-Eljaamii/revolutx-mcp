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
    {
        name: "risk-assessment",
        description: "Analyze portfolio risk, concentration, and exposure.",
        arguments: [
            {
                name: "currency",
                description: "Base currency for valuation (default: USD)",
                required: false,
            },
        ],
    },
    {
        name: "order-management",
        description: "Review and manage active orders with recommendations.",
        arguments: [],
    },
    {
        name: "market-comparison",
        description: "Compare market conditions across multiple trading pairs.",
        arguments: [
            {
                name: "symbols",
                description: "Comma-separated list of trading pairs (e.g., BTC-USD,ETH-USD,SOL-USD)",
                required: true,
            },
        ],
    },
    {
        name: "price-alert-setup",
        description: "Set up price monitoring strategy for a trading pair.",
        arguments: [
            {
                name: "symbol",
                description: "Trading pair symbol (e.g., BTC-USD)",
                required: true,
            },
            {
                name: "target_price",
                description: "Target price to monitor",
                required: true,
            },
            {
                name: "direction",
                description: "Direction to monitor: 'above' or 'below' (default: above)",
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

    if (name === "risk-assessment") {
        const currency = args?.currency || "USD";
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please perform a comprehensive risk assessment of my portfolio in ${currency}.
1. Call 'get_balances' to see my current holdings.
2. Call 'get_active_orders' to check pending orders and exposure.
3. For each significant asset, check the current price using 'get_order_book' or 'get_last_trades'.
4. Analyze:
   - Portfolio concentration (% allocation per asset)
   - Liquidity risk (can positions be easily exited?)
   - Pending order exposure (how much capital is committed?)
   - Diversification score
5. Provide risk rating (Low/Medium/High) and recommendations.`,
                    },
                },
            ],
        };
    }

    if (name === "order-management") {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please help me manage my active orders.
1. Call 'get_active_orders' to list all current orders.
2. For each order, use 'get_order_book' for the symbol to check:
   - How far the order is from current market price
   - Likelihood of execution
   - Current spread
3. Organize orders by:
   - Orders likely to execute soon
   - Orders far from market (may need adjustment)
   - Orders that might need cancellation
4. Ask if I want to cancel any specific orders (use 'cancel_order' tool if confirmed).`,
                    },
                },
            ],
        };
    }

    if (name === "market-comparison") {
        const symbols = args?.symbols;
        if (!symbols) {
            throw new Error("Argument 'symbols' is required");
        }
        const symbolList = symbols.split(',').map((s: string) => s.trim());
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please compare market conditions for: ${symbolList.join(', ')}.

For each symbol:
1. Call 'get_order_book' to analyze:
   - Current bid-ask spread
   - Liquidity (depth of order book)
   - Best bid/ask prices
2. Call 'get_last_trades' to check:
   - Recent trading volume
   - Price momentum
   - Trade frequency

Then provide a comparison table showing:
- Current price
- Spread (absolute and %)
- Liquidity score
- Recent momentum (bullish/bearish/neutral)
- Trading activity level

Recommend which pairs offer the best trading conditions.`,
                    },
                },
            ],
        };
    }

    if (name === "price-alert-setup") {
        const { symbol, target_price, direction } = args;
        if (!symbol) {
            throw new Error("Argument 'symbol' is required");
        }
        if (!target_price) {
            throw new Error("Argument 'target_price' is required");
        }
        const dir = direction || "above";
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `Please help me set up price monitoring for ${symbol} at ${target_price} (alert when price goes ${dir}).

1. Call 'get_order_book' for ${symbol} to get the current price.
2. Calculate the distance to target:
   - Current price vs target price
   - Percentage difference
3. Analyze the path to target:
   - Check order book depth between current and target price
   - Estimate likelihood of reaching target
4. Suggest monitoring strategy:
   - How frequently to check
   - Key support/resistance levels to watch
   - Potential actions when target is reached
5. Optionally suggest setting a limit order near the target price if appropriate.`,
                    },
                },
            ],
        };
    }

    throw new Error(`Prompt not found: ${name}`);
}
