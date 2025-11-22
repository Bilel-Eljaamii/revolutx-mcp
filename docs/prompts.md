# Prompts Guide

This document provides a complete guide to all prompts available in the RevolutX MCP Server.

## Overview

Prompts are pre-defined workflows that guide AI assistants through complex tasks using multiple tools. The RevolutX MCP server provides 7 prompts for common trading and portfolio management workflows.

---

## Market Analysis

### analyze-market

Analyze market conditions for a specific trading pair using order book and recent trades.

**Arguments**:
- `symbol` (required): The trading pair symbol (e.g., `BTC-USD`)

**Workflow**:
1. Fetches recent trades using `get_last_trades`
2. Retrieves order book for the symbol using `get_order_book`
3. Analyzes current sentiment (bullish/bearish/neutral)
4. Identifies key price levels

**Example Usage**:
```
Use the analyze-market prompt with symbol: BTC-USD
```

**Expected Output**:
- Recent trading activity summary
- Current bid-ask spread
- Market sentiment analysis
- Key support and resistance levels

---

### market-comparison

Compare market conditions across multiple trading pairs to find best trading opportunities.

**Arguments**:
- `symbols` (required): Comma-separated list of trading pairs (e.g., `BTC-USD,ETH-USD,SOL-USD`)

**Workflow**:
1. For each symbol, calls `get_order_book` to analyze spread and liquidity
2. For each symbol, calls `get_last_trades` to check volume and momentum
3. Creates comparison table with key metrics
4. Recommends best trading conditions

**Example Usage**:
```
Use the market-comparison prompt with symbols: BTC-USD,ETH-USD,SOL-USD
```

**Expected Output**:
- Comparison table showing:
  - Current price
  - Spread (absolute and %)
  - Liquidity score
  - Recent momentum
  - Trading activity level
- Recommendations for best pairs to trade

---

## Portfolio Management

### portfolio-summary

Analyze current portfolio value based on balances and market prices.

**Arguments**:
- `currency` (optional): Target currency to value portfolio in (default: `USD`)

**Workflow**:
1. Calls `get_balances` to retrieve current holdings
2. For each non-zero asset, fetches current price using `get_last_trades` or `get_order_book`
3. Calculates total portfolio value in target currency

**Example Usage**:
```
Use the portfolio-summary prompt with currency: EUR
```

**Expected Output**:
- List of all holdings with quantities
- Current value of each asset
- Total portfolio value
- Percentage allocation per asset

---

### risk-assessment

Perform comprehensive portfolio risk analysis including concentration, liquidity, and exposure.

**Arguments**:
- `currency` (optional): Base currency for valuation (default: `USD`)

**Workflow**:
1. Calls `get_balances` to see current holdings
2. Calls `get_active_orders` to check pending orders and exposure
3. For each significant asset, checks current price
4. Analyzes:
   - Portfolio concentration (% allocation per asset)
   - Liquidity risk (can positions be easily exited?)
   - Pending order exposure (how much capital is committed?)
   - Diversification score
5. Provides risk rating (Low/Medium/High) and recommendations

**Example Usage**:
```
Use the risk-assessment prompt
```

**Expected Output**:
- Portfolio concentration analysis
- Liquidity risk assessment
- Pending order exposure
- Overall risk rating
- Recommendations for risk mitigation

---

## Order Management

### order-management

Review and manage active orders with recommendations for cancellation or adjustment.

**Arguments**: None

**Workflow**:
1. Calls `get_active_orders` to list all current orders
2. For each order, uses `get_order_book` to check:
   - Distance from current market price
   - Likelihood of execution
   - Current spread
3. Organizes orders by priority:
   - Orders likely to execute soon
   - Orders far from market (may need adjustment)
   - Orders that might need cancellation
4. Asks for confirmation before canceling orders using `cancel_order`

**Example Usage**:
```
Use the order-management prompt
```

**Expected Output**:
- List of all active orders
- Analysis of each order's status
- Recommendations for action
- Guided cancellation process if needed

---

## Trading Strategies

### create-ladder-strategy

Generate a ladder trading strategy with multiple orders at different price levels.

**Arguments**:
- `symbol` (required): Trading pair symbol (e.g., `BTC-USD`)
- `start_price` (required): Starting price for the ladder
- `end_price` (required): Ending price for the ladder
- `num_levels` (required): Number of price levels
- `total_quantity` (required): Total quantity to distribute across levels
- `side` (required): `buy` or `sell`

**Workflow**:
1. Calculates price levels (linear distribution)
2. Calculates quantity per level
3. Shows the complete plan
4. Asks for confirmation before placing orders
5. Uses `place_order` for each level if confirmed

**Example Usage**:
```
Use the create-ladder-strategy prompt with:
- symbol: ETH-USD
- start_price: 2000
- end_price: 1800
- num_levels: 5
- total_quantity: 10
- side: buy
```

**Expected Output**:
- Detailed ladder plan showing all price levels and quantities
- Confirmation request
- Order placement results if confirmed

---

### price-alert-setup

Set up price monitoring strategy for a trading pair with target price alerts.

**Arguments**:
- `symbol` (required): Trading pair symbol (e.g., `BTC-USD`)
- `target_price` (required): Target price to monitor
- `direction` (optional): Direction to monitor - `above` or `below` (default: `above`)

**Workflow**:
1. Calls `get_order_book` to get current price
2. Calculates distance to target (absolute and percentage)
3. Analyzes order book depth between current and target price
4. Estimates likelihood of reaching target
5. Suggests monitoring strategy:
   - How frequently to check
   - Key support/resistance levels
   - Potential actions when target is reached
6. Optionally suggests setting a limit order near target

**Example Usage**:
```
Use the price-alert-setup prompt with:
- symbol: BTC-USD
- target_price: 50000
- direction: above
```

**Expected Output**:
- Current price vs target price
- Percentage difference
- Path to target analysis
- Monitoring strategy recommendations
- Suggested actions

---

## Best Practices

### Combining Prompts

Prompts can be used in sequence for comprehensive workflows:

1. **Daily routine**:
   - `portfolio-summary` → Check overall value
   - `risk-assessment` → Assess current risk
   - `order-management` → Review pending orders

2. **Before trading**:
   - `market-comparison` → Find best opportunities
   - `analyze-market` → Deep dive on chosen pair
   - `create-ladder-strategy` → Execute strategy

3. **Risk management**:
   - `risk-assessment` → Identify issues
   - `order-management` → Adjust exposure
   - `portfolio-summary` → Verify changes

### Customization

While prompts provide structured workflows, you can always:
- Use individual tools for specific needs
- Modify prompt parameters for different scenarios
- Combine prompt outputs with custom analysis

## Next Steps

- See [Tools Reference](tools.md) to understand underlying tools
- Check [Examples](examples.md) for complete workflow examples
- Review [Architecture](architecture.md) to understand how prompts work
