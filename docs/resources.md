# Resources Reference

This document describes the resources available in the RevolutX MCP Server.

## Overview

Resources in MCP are static or dynamic data sources that can be read by clients. The RevolutX MCP server currently provides 1 resource.

## Available Resources

### revolutx://pairs 🔒

A JSON resource listing all available currency pairs and their configuration.

**URI**: `revolutx://pairs`

**Authentication**: Required (needs `REVOLUTX_API_KEY`)

**MIME Type**: `application/json`

**Description**: Provides comprehensive configuration for all trading pairs available on the RevolutX exchange.

**Data Format**:
```json
[
  {
    "symbol": "BTC-USD",
    "base": "BTC",
    "quote": "USD",
    "min_order_size": "0.001",
    "max_order_size": "100",
    "price_precision": 2,
    "quantity_precision": 8,
    "status": "active"
  },
  {
    "symbol": "ETH-USD",
    "base": "ETH",
    "quote": "USD",
    "min_order_size": "0.01",
    "max_order_size": "1000",
    "price_precision": 2,
    "quantity_precision": 8,
    "status": "active"
  }
]
```

**Usage**:

In an MCP client, you can read this resource to get the latest trading pair configuration:

```
Read resource: revolutx://pairs
```

**Use Cases**:
- Validate trading pair symbols before placing orders
- Check minimum and maximum order sizes
- Determine price and quantity precision for orders
- List all available trading pairs

**Error Handling**:
- Returns error if `REVOLUTX_API_KEY` is not set
- Returns error if API key is invalid
- Returns error if the RevolutX API is unavailable

## Resource vs Tool

**When to use a resource**:
- You need static or semi-static configuration data
- You want to cache data for multiple operations
- You need to reference data multiple times

**When to use a tool**:
- You need to perform an action (like placing an order)
- You need real-time data (like current order book)
- You need to pass parameters for specific queries

## Next Steps

- See [Tools Reference](tools.md) for available tools
- Check [Examples](examples.md) for usage scenarios
- Learn about [Prompts](prompts.md) that use resources
