# RevolutX MCP Server

A Model Context Protocol (MCP) server for the [Revolut X Crypto Exchange REST API](https://developer.revolut.com/docs/x-api/revolut-x-crypto-exchange-rest-api). This server exposes a comprehensive set of tools that allow AI agents to interact with the Revolut X exchange — placing orders, fetching market data, managing positions, and more.

All private API requests are authenticated using **Ed25519 request signing** (`X-Revx-Signature`), following the official Revolut X authentication protocol.

---

## Features

### Orders
| Tool | Description | Auth |
|------|-------------|------|
| `place_order` | Place a new limit or market order | ✅ Private |
| `cancel_order` | Cancel an active order by ID | ✅ Private |
| `cancel_all_orders` | Cancel all active orders | ✅ Private |
| `get_order` | Get details of a specific order by ID | ✅ Private |
| `get_active_orders` | Get active orders with filters (symbols, states, types, side) | ✅ Private |
| `get_historical_orders` | Get historical orders with date range and pagination | ✅ Private |
| `get_order_fills` | Get fills (trades) for a specific order | ✅ Private |

### Trades
| Tool | Description | Auth |
|------|-------------|------|
| `get_all_trades` | Get all public trades (market history) for a symbol | ✅ Private |
| `get_private_trades` | Get authenticated client trade history | ✅ Private |

### Market Data
| Tool | Description | Auth |
|------|-------------|------|
| `get_order_book_snapshot` | Authenticated order book snapshot for a trading pair | ✅ Private |
| `get_candles` | Historical OHLCV candle data with configurable intervals | ✅ Private |
| `get_tickers` | Latest bid/ask/mid/last prices for all pairs | ✅ Private |

### Public Market Data
| Tool | Description | Auth |
|------|-------------|------|
| `get_last_trades` | Latest 100 trades on the exchange | 🌐 Public |
| `get_order_book` | Public order book (max 5 price levels) | 🌐 Public |

### Configuration
| Tool | Description | Auth |
|------|-------------|------|
| `get_currencies` | All supported currencies and their configuration | ✅ Private |
| `get_pairs` | All traded currency pairs and their configuration | ✅ Private |

### Balance
| Tool | Description | Auth |
|------|-------------|------|
| `get_balances` | Account balances for the authenticated user | ✅ Private |

---

## Prompts

| Prompt | Description |
|--------|-------------|
| `analyze-market` | Analyze market conditions for a specific trading pair |
| `create-ladder-strategy` | Generate a ladder trading strategy with multiple orders |
| `portfolio-summary` | Analyze current portfolio value based on balances and prices |
| `risk-assessment` | Comprehensive portfolio risk analysis |
| `order-management` | Review and manage active orders with recommendations |
| `market-comparison` | Compare conditions across multiple trading pairs |
| `price-alert-setup` | Set up price monitoring strategy with target alerts |

---

## Prerequisites

- **Node.js** >= 18
- **npm**
- A **Revolut X API Key** (obtain from the Revolut X web app)
- An **Ed25519 private key** (for request signing)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Bilel-Eljaamii/revolutx-mcp.git
    cd revolutx-mcp
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2. Edit `.env` and configure both required variables:

    ```bash
    # Your Revolut X API Key (64-character alphanumeric string)
    REVOLUTX_API_KEY=your_api_key_here

    # Your Ed25519 Private Key for request signing
    REVOLUTX_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
    your_base64_private_key_here
    -----END PRIVATE KEY-----"
    ```

> **Note:** Both `REVOLUTX_API_KEY` and `REVOLUTX_PRIVATE_KEY` are required for all private endpoints. Public endpoints (`get_last_trades`, `get_order_book`) work without authentication.

### Generating an Ed25519 Key Pair

```bash
openssl genpkey -algorithm Ed25519 -out private.pem
openssl pkey -in private.pem -pubout -out public.pem
```

Upload the **public key** to your Revolut X account settings, and set the contents of `private.pem` as `REVOLUTX_PRIVATE_KEY` in your `.env` file.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run dev` | Build and run the server |
| `npm start` | Run the compiled server |
| `npm run typecheck` | Type-check without emitting files |
| `npm run lint` | Run ESLint on source files |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm run clean` | Remove the `dist/` directory |
| `npm run rebuild` | Clean and rebuild |
| `npm test` | Run tests with Jest |

---

## Usage

### Build & Run

```bash
npm run build
npm start
```

Or in a single step:

```bash
npm run dev
```

### MCP Client Configuration

To use this server with an MCP client (e.g., Claude Desktop, Cursor), add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "revolutx": {
      "command": "node",
      "args": ["/path/to/revolutx-mcp/dist/index.js"],
      "env": {
        "REVOLUTX_API_KEY": "your_api_key_here",
        "REVOLUTX_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\nyour_base64_key\n-----END PRIVATE KEY-----"
      }
    }
  }
}
```

*Replace `/path/to/revolutx-mcp` with the absolute path to your project directory.*

---

## Architecture

```
src/
├── index.ts                          # MCP server entry point
├── utils.ts                          # Auth (Ed25519 signing), error handling
├── tools/
│   ├── balance/
│   │   └── get_balances.ts
│   ├── configuration/
│   │   ├── get_currencies.ts
│   │   └── get_pairs.ts
│   ├── orders/
│   │   ├── place_order.ts
│   │   ├── cancel_order_by_id.ts
│   │   ├── cancel_all_orders.ts
│   │   ├── get_order_by_id.ts
│   │   ├── get_active_orders.ts
│   │   ├── get_historical_orders.ts
│   │   └── get_order_fills.ts
│   ├── trades/
│   │   ├── get_all_trades.ts
│   │   └── get_private_trades.ts
│   ├── market_data/
│   │   ├── get_order_book_snapshot.ts
│   │   ├── get_candles.ts
│   │   └── get_tickers.ts
│   └── public_market_data/
│       ├── get_last_trades.ts
│       └── get_order_book.ts
├── resources/
│   └── index.ts
└── prompts/
    └── index.ts
```

### Authentication Flow

All private API requests follow the Revolut X Ed25519 signing protocol:

1. Generate a timestamp (`Date.now()`)
2. Concatenate: `timestamp + HTTP_METHOD + path + query + body`
3. Sign with `crypto.sign(null, message, privateKey)` (pure Ed25519)
4. Attach headers: `X-Revx-API-Key`, `X-Revx-Timestamp`, `X-Revx-Signature`

---

## API Reference

This server implements the complete [Revolut X Crypto Exchange REST API](https://developer.revolut.com/docs/x-api/revolut-x-crypto-exchange-rest-api):

- [Orders](https://developer.revolut.com/docs/x-api/orders)
- [Trades](https://developer.revolut.com/docs/x-api/trades)
- [Market Data](https://developer.revolut.com/docs/x-api/market-data)
- [Public Market Data](https://developer.revolut.com/docs/x-api/public-market-data)
- [Configuration](https://developer.revolut.com/docs/x-api/configuration)
- [Balance](https://developer.revolut.com/docs/x-api/balance)

---

## License

ISC
