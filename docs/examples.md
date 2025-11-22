# Examples

This document provides practical examples of using the RevolutX MCP Server.

## Basic Examples

### Example 1: Check Your Balance

**Goal**: See what assets you currently hold.

**Steps**:
```
1. Use the get_balances tool
```

**Expected Response**:
```json
[
  {
    "currency": "BTC",
    "available": "0.5",
    "reserved": "0.1",
    "total": "0.6"
  },
  {
    "currency": "USD",
    "available": "10000.00",
    "reserved": "0.00",
    "total": "10000.00"
  }
]
```

---

### Example 2: Check Market Price

**Goal**: Get the current market price for BTC-USD.

**Steps**:
```
1. Use get_order_book with symbol: BTC-USD
2. Look at the best bid and best ask prices
```

**Expected Response**:
The order book will show current bids and asks. The best bid is the highest buy price, and the best ask is the lowest sell price.

---

### Example 3: View Recent Trading Activity

**Goal**: See what trades have been happening recently.

**Steps**:
```
1. Use the get_last_trades tool
```

**Expected Response**:
List of the last 100 trades with prices, quantities, and timestamps.

---

## Workflow Examples

### Example 4: Daily Portfolio Check

**Goal**: Complete daily portfolio review.

**Workflow**:
```
1. Use portfolio-summary prompt with currency: USD
   → See total portfolio value and allocation

2. Use risk-assessment prompt
   → Check if portfolio is too concentrated

3. Use order-management prompt
   → Review any pending orders
```

**Benefits**:
- Quick overview of portfolio health
- Identify any risk issues
- Manage pending orders

---

### Example 5: Research Before Trading

**Goal**: Research multiple coins before deciding which to trade.

**Workflow**:
```
1. Use market-comparison prompt with symbols: BTC-USD,ETH-USD,SOL-USD
   → Compare market conditions

2. Pick the best pair from the comparison

3. Use analyze-market prompt with the chosen symbol
   → Deep dive into that market

4. Make informed trading decision
```

**Benefits**:
- Compare multiple opportunities
- Focus on best market conditions
- Detailed analysis before trading

---

### Example 6: Execute a Ladder Buy Strategy

**Goal**: Buy BTC gradually across multiple price levels.

**Scenario**: You want to buy 1 BTC total, spread across 5 orders from $44,000 to $45,000.

**Workflow**:
```
1. Use create-ladder-strategy prompt with:
   - symbol: BTC-USD
   - start_price: 44000
   - end_price: 45000
   - num_levels: 5
   - total_quantity: 1
   - side: buy

2. Review the generated plan

3. Confirm to place the orders
```

**Expected Plan**:
```
Level 1: Buy 0.2 BTC at $44,000
Level 2: Buy 0.2 BTC at $44,250
Level 3: Buy 0.2 BTC at $44,500
Level 4: Buy 0.2 BTC at $44,750
Level 5: Buy 0.2 BTC at $45,000
```

**Benefits**:
- Dollar-cost averaging
- Reduced risk of buying at the top
- Automated calculation of levels

---

### Example 7: Set Up Price Alert

**Goal**: Monitor BTC price and get notified when it reaches $50,000.

**Workflow**:
```
1. Use price-alert-setup prompt with:
   - symbol: BTC-USD
   - target_price: 50000
   - direction: above

2. Review the monitoring strategy

3. Follow the suggested monitoring approach
```

**Expected Output**:
- Current price vs target
- Percentage to target
- Suggested check frequency
- Potential actions when target is reached

---

## Advanced Examples

### Example 8: Risk Management After Market Drop

**Scenario**: Market has dropped 10% and you want to assess your risk.

**Workflow**:
```
1. Use risk-assessment prompt
   → Identify current risk level

2. If risk is high:
   a. Use order-management prompt
      → Cancel risky pending orders
   
   b. Use get_balances
      → Check available liquidity
   
   c. Consider rebalancing

3. Use portfolio-summary prompt
   → Verify new portfolio state
```

---

### Example 9: Finding Best Trading Opportunity

**Scenario**: You have $10,000 to invest and want to find the best opportunity.

**Workflow**:
```
1. Use market-comparison prompt with symbols: BTC-USD,ETH-USD,SOL-USD,AVAX-USD
   → Compare all major pairs

2. Identify the pair with:
   - Best liquidity
   - Tightest spread
   - Positive momentum

3. Use analyze-market prompt on the chosen pair
   → Confirm the opportunity

4. Use create-ladder-strategy prompt
   → Execute the trade strategically
```

---

### Example 10: Managing Multiple Active Orders

**Scenario**: You have 10 active orders and want to clean up.

**Workflow**:
```
1. Use order-management prompt
   → Get organized view of all orders

2. Review the categorization:
   - Orders likely to execute soon (keep)
   - Orders far from market (cancel or adjust)
   - Stale orders (cancel)

3. Cancel orders as recommended

4. Use get_active_orders to verify
   → Confirm only desired orders remain
```

---

## Integration Examples

### Example 11: Using with Claude Desktop

**Setup**:
1. Configure Claude Desktop with the server (see [Getting Started](getting-started.md))
2. Restart Claude Desktop

**Usage**:
```
You: "Check my crypto balances"
Claude: [Uses get_balances tool]
Claude: "You have 0.5 BTC and $10,000 USD..."

You: "What's the current BTC price?"
Claude: [Uses get_order_book with BTC-USD]
Claude: "The current BTC price is around $45,000..."

You: "Give me a portfolio summary"
Claude: [Uses portfolio-summary prompt]
Claude: [Calls get_balances, then get_order_book for each asset]
Claude: "Your total portfolio value is $32,500..."
```

---

### Example 12: Automated Daily Report

**Goal**: Get a comprehensive daily report.

**Prompt to AI**:
```
Please give me a complete daily crypto portfolio report:
1. Portfolio summary in USD
2. Risk assessment
3. Review of active orders
4. Market analysis for my top 3 holdings
```

**AI Workflow**:
1. Uses `portfolio-summary` prompt
2. Uses `risk-assessment` prompt
3. Uses `order-management` prompt
4. Uses `analyze-market` prompt for each top holding

**Result**: Comprehensive daily report with all key information.

---

## Tips and Best Practices

### Combining Tools and Prompts

- **Prompts** for workflows → Use when you want guided multi-step processes
- **Tools** for specific data → Use when you need a specific piece of information

### Error Handling

If a tool fails:
1. Check your API key is set correctly
2. Verify you have network connectivity
3. Check the RevolutX API status
4. Review error message for specific issues

### Rate Limiting

To avoid rate limits:
- Don't call tools in tight loops
- Use prompts that batch operations efficiently
- Cache data when possible (e.g., trading pair configuration)

### Security

- Never share your API key
- Use read-only API keys when possible
- Be cautious with trading tools (they execute real transactions)

## Next Steps

- Review [Tools Reference](tools.md) for all available tools
- Check [Prompts Guide](prompts.md) for all workflows
- See [Troubleshooting](troubleshooting.md) if you encounter issues
