# RevolutX MCP Server

A Model Context Protocol (MCP) server for the RevolutX Crypto Exchange API. This server exposes various tools to interact with RevolutX, allowing AI agents to fetch market data and account information.

## Features

The following tools are available:

*   **`get_balances`**: Get crypto exchange account balances (Private).
*   **`get_active_orders`**: Get active crypto exchange orders (Private).
*   **`get_currencies`**: Get configuration for all currencies (Private).
*   **`get_pairs`**: Get configuration for all traded currency pairs (Private).
*   **`get_last_trades`**: Get the latest 100 trades for the exchange (Public).
*   **`get_order_book`**: Get the order book for a specific pair (Public).
*   **`place_order`**: Place a new limit or market order (Private).
*   **`cancel_order`**: Cancel an active order by ID (Private).
*   **`get_order`**: Get details of a specific order (Private).

## Resources

### @ToDo
*   **`revolutx://pairs`**: A JSON resource listing all available currency pairs and their configuration (Private).

## Prompts

*   **`analyze-market`**: Analyze market conditions for a specific trading pair using order book and recent trades.
*   **`create-ladder-strategy`**: Generate a ladder trading strategy with multiple orders at different price levels.
*   **`portfolio-summary`**: Analyze current portfolio value based on balances and market prices.
*   **`risk-assessment`**: Perform comprehensive portfolio risk analysis including concentration, liquidity, and exposure.
*   **`order-management`**: Review and manage active orders with recommendations for cancellation or adjustment.
*   **`market-comparison`**: Compare market conditions across multiple trading pairs to find best trading opportunities.
*   **`price-alert-setup`**: Set up price monitoring strategy for a trading pair with target price alerts.


## Documentation

For comprehensive documentation, see the [docs](docs/) folder:

- **[Getting Started](docs/getting-started.md)** - Installation and setup guide
- **[Tools Reference](docs/tools.md)** - Complete API reference for all tools
- **[Resources Reference](docs/resources.md)** - Available resources documentation
- **[Prompts Guide](docs/prompts.md)** - Workflow prompts and examples
- **[Architecture](docs/architecture.md)** - System architecture and design
- **[Examples](docs/examples.md)** - Practical usage examples
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions


## Prerequisites

*   Node.js (v16 or higher)
*   npm
*   A RevolutX API Key (required for private endpoints)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Bilel-Eljaamii/revolutx-mcp.git
    cd revolutx-mcp
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

2.  Edit `.env` and add your RevolutX API Key:
    ```
    REVOLUTX_API_KEY=your_api_key_here
    ```
    *Note: The API Key is optional if you only intend to use public endpoints.*

## Usage

### Building the Server

Compile the TypeScript code:

```bash
npm run build
```

### Running the Server

Start the MCP server on stdio:

```bash
npm start
```

### Testing

The project includes a suite of verification scripts in `test/ct`:

*   **Balances**: `npx tsx test/ct/test_integration.ts`
*   **Currencies**: `npx tsx test/ct/test_currencies.ts`
*   **Pairs**: `npx tsx test/ct/test_pairs.ts`
*   **Active Orders**: `npx tsx test/ct/test_active_orders.ts`
*   **Last Trades**: `npx tsx test/ct/test_public_trades.ts`
*   **Order Book**: `npx tsx test/ct/test_order_book.ts`

### Unit Testing

Run the unit tests with Jest:

```bash
npm test
```

## MCP Client Configuration

To use this server with an MCP client (like Claude Desktop), add the following configuration:

```json
{
  "mcpServers": {
    "revolutx": {
      "command": "node",
      "args": ["/path/to/revolutx-mcp/dist/index.js"],
      "env": {
        "REVOLUTX_API_KEY": "your_api_key_here"
      }
    }
  }
}
```
*Replace `/path/to/revolutx-mcp` with the absolute path to your project directory.*
