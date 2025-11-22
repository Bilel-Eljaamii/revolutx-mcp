# Tools Reference

This document provides a complete reference for all tools available in the RevolutX MCP Server.

## Overview

The server provides 9 tools organized into 5 categories:

- **Account Management** (2 tools)
- **Configuration** (2 tools)
- **Public Market Data** (2 tools)
- **Trading** (3 tools)

## Authentication

Tools marked with 🔒 require a valid `REVOLUTX_API_KEY` to be set in your environment.

---

## Account Management

### get_balances 🔒

Get crypto exchange account balances for the requesting user.

**Parameters**: None

**Response**:
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
    "reserved": "500.00",
    "total": "10500.00"
  }
]
```

**Example Usage**:
```
Use the get_balances tool to see my current holdings
```

**Error Handling**:
- Returns error if `REVOLUTX_API_KEY` is not set
- Returns error if API key is invalid

---

### get_active_orders 🔒

Get active crypto exchange orders for the requesting user.

**Parameters**:
- `cursor` (string, optional): Cursor for pagination, obtained from `metadata.nextCursor`
- `limit` (integer, optional): Maximum number of records returned (default: 100)

**Response**:
```json
{
  "data": [
    {
      "id": "order_123",
      "symbol": "BTC-USD",
      "side": "buy",
      "type": "limit",
      "quantity": "0.1",
      "price": "45000",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "metadata": {
    "nextCursor": "cursor_abc123"
  }
}
```

**Example Usage**:
```
Use get_active_orders to list all my pending orders
```

---

## Configuration

### get_currencies 🔒

Get configuration for all currencies used on the exchange.

**Parameters**: None

**Response**:
```json
[
  {
    "code": "BTC",
    "name": "Bitcoin",
    "precision": 8,
    "min_withdrawal": "0.001"
  },
  {
    "code": "USD",
    "name": "US Dollar",
    "precision": 2,
    "min_withdrawal": "10.00"
  }
]
```

**Example Usage**:
```
Use get_currencies to see what currencies are available
```

---

### get_pairs 🔒

Get configuration for all traded currency pairs.

**Parameters**: None

**Response**:
```json
[
  {
    "symbol": "BTC-USD",
    "base": "BTC",
    "quote": "USD",
    "min_order_size": "0.001",
    "max_order_size": "100",
    "price_precision": 2,
    "quantity_precision": 8
  }
]
```

**Example Usage**:
```
Use get_pairs to see all available trading pairs
```

---

## Public Market Data

### get_last_trades

Get the list of the latest 100 trades executed on Revolut X crypto exchange.

**Authentication**: Not required (public endpoint)

**Parameters**: None

**Response**:
```json
{
  "data": [
    {
      "tdt": "2024-01-01T12:00:00Z",
      "aid": "BTC",
      "anm": "Bitcoin",
      "p": "45000.00",
      "pc": "USD",
      "pn": "US Dollar",
      "q": "0.1",
      "qc": "BTC",
      "qn": "Bitcoin",
      "ve": "REVOLUTX",
      "pdt": "2024-01-01T12:00:01Z",
      "vp": "REVOLUTX",
      "tid": "trade_123"
    }
  ],
  "metadata": {
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

**Example Usage**:
```
Use get_last_trades to see recent trading activity
```

---

### get_order_book

Fetch the current order book (bids and asks) for a given trading pair (with a maximum of 5 price levels).

**Authentication**: Not required (public endpoint)

**Parameters**:
- `symbol` (string, required): The trading pair symbol (e.g., `BTC-USD`)

**Response**:
```json
{
  "data": {
    "asks": [
      {
        "aid": "BTC",
        "anm": "Bitcoin",
        "s": "SELL",
        "p": "45100.00",
        "pc": "USD",
        "pn": "US Dollar",
        "q": "0.5",
        "qc": "BTC",
        "qn": "Bitcoin",
        "ve": "REVOLUTX",
        "no": "3",
        "ts": "source",
        "pdt": "2024-01-01T12:00:00Z"
      }
    ],
    "bids": [
      {
        "aid": "BTC",
        "anm": "Bitcoin",
        "s": "BUY",
        "p": "45000.00",
        "pc": "USD",
        "pn": "US Dollar",
        "q": "0.8",
        "qc": "BTC",
        "qn": "Bitcoin",
        "ve": "REVOLUTX",
        "no": "5",
        "ts": "source",
        "pdt": "2024-01-01T12:00:00Z"
      }
    ]
  },
  "metadata": {
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

**Example Usage**:
```
Use get_order_book with symbol BTC-USD to see the current order book
```

---

## Trading

### place_order 🔒

Place a new order on the exchange.

> **⚠️ WARNING**: This performs a real financial transaction!

**Parameters**:
- `symbol` (string, required): The trading pair symbol (e.g., `BTC-USD`)
- `side` (string, required): Side of the order (`buy` or `sell`)
- `type` (string, required): Type of the order (`market` or `limit`)
- `quantity` (string, required): Quantity to buy or sell
- `price` (string, optional): Price for limit orders (required if type is `limit`)

**Response**:
```json
{
  "id": "order_123",
  "symbol": "BTC-USD",
  "side": "buy",
  "type": "limit",
  "quantity": "0.1",
  "price": "45000",
  "status": "active",
  "created_at": "2024-01-01T12:00:00Z"
}
```

**Example Usage**:
```
Use place_order to buy 0.1 BTC at 45000 USD (limit order)
Parameters:
- symbol: BTC-USD
- side: buy
- type: limit
- quantity: 0.1
- price: 45000
```

**Error Handling**:
- Returns error if `price` is missing for limit orders
- Returns error if API key is not set
- Returns error if insufficient balance

---

### cancel_order 🔒

Cancel an active order by its ID.

**Parameters**:
- `order_id` (string, required): The ID of the order to cancel

**Response**:
```
Order cancelled successfully.
```

Or the API response data if available.

**Example Usage**:
```
Use cancel_order with order_id: order_123
```

---

### get_order 🔒

Get details of a specific order by its ID.

**Parameters**:
- `order_id` (string, required): The ID of the order to retrieve

**Response**:
```json
{
  "id": "order_123",
  "symbol": "BTC-USD",
  "side": "buy",
  "type": "limit",
  "quantity": "0.1",
  "price": "45000",
  "filled_quantity": "0.05",
  "status": "partially_filled",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:30:00Z"
}
```

**Example Usage**:
```
Use get_order with order_id: order_123 to check the order status
```

---

## Error Responses

All tools may return errors in the following format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Description of the error"
    }
  ],
  "isError": true
}
```

Common errors:
- **Authentication errors**: Missing or invalid API key
- **Validation errors**: Invalid parameters
- **API errors**: RevolutX API errors (rate limits, server errors, etc.)

## Rate Limits

Be mindful of API rate limits when using these tools. The RevolutX API may have rate limiting in place.

## Next Steps

- Learn about [Prompts](prompts.md) that combine multiple tools
- See [Examples](examples.md) for complete workflows
- Check [Troubleshooting](troubleshooting.md) if you encounter issues
