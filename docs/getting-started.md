# Getting Started

This guide will help you set up and start using the RevolutX MCP Server.

## Prerequisites

- **Node.js** v16 or higher
- **npm** package manager
- **RevolutX API Key** (required for private endpoints)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Bilel-Eljaamii/revolutx-mcp.git
cd revolutx-mcp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` and add your RevolutX API key:

```env
REVOLUTX_API_KEY=your_api_key_here
```

> **Note**: The API key is optional if you only plan to use public endpoints (`get_last_trades`, `get_order_book`).

## Building the Server

Compile the TypeScript code:

```bash
npm run build
```

This creates the compiled JavaScript in the `dist/` directory.

## Running the Server

Start the MCP server:

```bash
npm start
```

The server runs on stdio and communicates using the Model Context Protocol.

## MCP Client Configuration

To use this server with an MCP client like Claude Desktop, add this configuration:

### Claude Desktop Configuration

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the RevolutX server:

```json
{
  "mcpServers": {
    "revolutx": {
      "command": "node",
      "args": ["/absolute/path/to/revolutx-mcp/dist/index.js"],
      "env": {
        "REVOLUTX_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

> **Important**: Replace `/absolute/path/to/revolutx-mcp` with the actual absolute path to your project directory.

## Verifying the Installation

### Run Tests

Verify everything is working:

```bash
npm test
```

### Test Individual Components

Test specific functionality:

```bash
# Test balances endpoint
npx tsx test/ct/test_integration.ts

# Test public market data
npx tsx test/ct/test_public_trades.ts

# Test order book
npx tsx test/ct/test_order_book.ts
```

## First Steps

Once configured, you can:

1. **Query your balances**: Use the `get_balances` tool
2. **Check market data**: Use `get_last_trades` or `get_order_book`
3. **Analyze markets**: Try the `analyze-market` prompt
4. **Review your portfolio**: Use the `portfolio-summary` prompt

## Example Usage

Here's a simple workflow to get started:

1. **Check available trading pairs**:
   ```
   Use the get_pairs tool
   ```

2. **Analyze a market**:
   ```
   Use the analyze-market prompt with symbol: BTC-USD
   ```

3. **Check your balances**:
   ```
   Use the get_balances tool
   ```

4. **Get a portfolio summary**:
   ```
   Use the portfolio-summary prompt
   ```

## Next Steps

- Explore the [Tools Reference](tools.md) to see all available tools
- Learn about [Prompts](prompts.md) for common workflows
- Check out [Examples](examples.md) for more detailed usage scenarios

## Troubleshooting

If you encounter issues, see the [Troubleshooting Guide](troubleshooting.md).

Common issues:
- **API Key errors**: Ensure your API key is correctly set in `.env`
- **Build errors**: Make sure you're using Node.js v16+
- **Connection issues**: Verify your network connection and API key validity
