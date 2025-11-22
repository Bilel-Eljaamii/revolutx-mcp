# Architecture

This document describes the architecture and design patterns of the RevolutX MCP Server.

## Overview

The RevolutX MCP Server is built using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) SDK and provides a bridge between AI assistants and the RevolutX Crypto Exchange API.

## Technology Stack

- **Runtime**: Node.js (v16+)
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.22.0
- **HTTP Client**: Axios
- **Testing**: Jest
- **Build Tool**: TypeScript Compiler (tsc)

## Project Structure

```
revolutx-mcp/
├── src/
│   ├── index.ts              # Main server entry point
│   ├── utils.ts              # Shared utilities and helpers
│   ├── tools/                # Tool implementations
│   │   ├── balance/
│   │   │   └── get_balances.ts
│   │   ├── configuration/
│   │   │   ├── get_currencies.ts
│   │   │   └── get_pairs.ts
│   │   ├── orders/
│   │   │   └── get_active_orders.ts
│   │   ├── public_market_data/
│   │   │   ├── get_last_trades.ts
│   │   │   └── get_order_book.ts
│   │   └── trading/
│   │       ├── place_order.ts
│   │       ├── cancel_order.ts
│   │       └── get_order.ts
│   ├── resources/
│   │   └── index.ts          # Resource definitions and handlers
│   └── prompts/
│       └── index.ts          # Prompt definitions and handlers
├── test/
│   ├── ut/                   # Unit tests
│   │   ├── tools.test.ts
│   │   ├── resources.test.ts
│   │   └── prompts.test.ts
│   └── ct/                   # Component tests
│       ├── test_integration.ts
│       ├── test_currencies.ts
│       └── ...
├── docs/                     # Documentation
├── dist/                     # Compiled JavaScript (generated)
└── package.json
```

## Core Components

### 1. MCP Server (`src/index.ts`)

The main server file that:
- Initializes the MCP server with stdio transport
- Registers request handlers for all MCP operations
- Routes tool calls to appropriate handlers
- Manages resources and prompts

**Key Code**:
```typescript
const server = new Server(
    {
        name: "revolutx-mcp",
        version: "0.1.0",
    },
    {
        capabilities: {
            tools: {},
            resources: {},
            prompts: {},
        },
    }
);
```

### 2. Tools (`src/tools/`)

Each tool is organized by category and follows a consistent pattern:

**Tool Definition**:
```typescript
export const toolName: Tool = {
    name: "tool_name",
    description: "Tool description",
    inputSchema: {
        type: "object",
        properties: { /* parameters */ },
        required: [ /* required params */ ],
    },
};
```

**Handler Function**:
```typescript
export async function handleToolName(args: any) {
    // 1. Validate API key (if needed)
    // 2. Extract and validate arguments
    // 3. Make API call to RevolutX
    // 4. Format and return response
    // 5. Handle errors
}
```

### 3. Resources (`src/resources/`)

Resources provide static or semi-static data:

**Resource Definition**:
```typescript
export const resources: Resource[] = [
    {
        uri: "revolutx://resource-name",
        name: "Resource Name",
        description: "Resource description",
        mimeType: "application/json",
    },
];
```

**Handler Function**:
```typescript
export async function handleReadResource(uri: string) {
    // 1. Match URI
    // 2. Validate authentication
    // 3. Fetch data from API
    // 4. Return formatted response
}
```

### 4. Prompts (`src/prompts/`)

Prompts define workflows that guide AI assistants:

**Prompt Definition**:
```typescript
export const prompts: Prompt[] = [
    {
        name: "prompt-name",
        description: "Prompt description",
        arguments: [
            {
                name: "arg_name",
                description: "Argument description",
                required: true,
            },
        ],
    },
];
```

**Handler Function**:
```typescript
export async function handleGetPrompt(name: string, args: any) {
    // 1. Match prompt name
    // 2. Validate arguments
    // 3. Return structured message with instructions
}
```

### 5. Utilities (`src/utils.ts`)

Shared utilities include:
- API configuration (`REVOLUTX_API_URL`, `API_KEY`)
- Error handling (`handleAxiosError`)
- Authentication checking (`checkApiKey`)

## Design Patterns

### Handler Pattern

All tools, resources, and prompts follow a consistent handler pattern:

1. **Validation**: Check required parameters and authentication
2. **Execution**: Perform the operation (API call, data fetch, etc.)
3. **Formatting**: Format response in MCP-compatible structure
4. **Error Handling**: Catch and format errors appropriately

### Error Handling

Errors are handled consistently across the codebase:

```typescript
try {
    // Operation
} catch (error: any) {
    return handleAxiosError(error, "operation description");
}
```

The `handleAxiosError` utility formats errors into MCP-compatible responses.

### Authentication

Private endpoints use a consistent authentication check:

```typescript
const apiKeyError = checkApiKey();
if (apiKeyError) return apiKeyError;
```

This ensures all private tools fail gracefully when the API key is missing.

## Data Flow

### Tool Call Flow

```
1. MCP Client sends tool call request
   ↓
2. Server receives request via stdio
   ↓
3. CallToolRequestSchema handler routes to tool handler
   ↓
4. Tool handler validates and processes request
   ↓
5. API call to RevolutX (if needed)
   ↓
6. Response formatted and returned
   ↓
7. MCP Client receives response
```

### Resource Read Flow

```
1. MCP Client requests resource
   ↓
2. Server receives ReadResourceRequest
   ↓
3. handleReadResource matches URI
   ↓
4. Resource data fetched from API
   ↓
5. Data formatted and returned
   ↓
6. MCP Client receives resource data
```

### Prompt Flow

```
1. MCP Client requests prompt
   ↓
2. Server receives GetPromptRequest
   ↓
3. handleGetPrompt matches name and validates args
   ↓
4. Prompt message generated with instructions
   ↓
5. MCP Client receives prompt
   ↓
6. AI assistant follows prompt instructions
   ↓
7. AI assistant calls tools as directed
```

## Communication Protocol

The server uses **stdio transport** for communication:

- **Input**: JSON-RPC messages on stdin
- **Output**: JSON-RPC responses on stdout
- **Logging**: Errors and logs to stderr

This allows the server to be easily integrated with MCP clients like Claude Desktop.

## Security Considerations

### API Key Management

- API keys are stored in environment variables (`.env` file)
- Never logged or exposed in responses
- Validated before each private API call

### Input Validation

- All tool parameters are validated against schemas
- Type checking enforced by TypeScript
- Required parameters checked before execution

### Error Messages

- Error messages don't expose sensitive information
- API errors are sanitized before returning to client

## Testing Strategy

### Unit Tests (`test/ut/`)

- Test tool handlers with mocked API responses
- Test prompt generation and argument validation
- Test resource handlers
- Use Jest with mocked axios

### Component Tests (`test/ct/`)

- Test actual API integration (requires API key)
- Verify end-to-end functionality
- Test error handling with real API

## Extension Points

### Adding a New Tool

1. Create tool file in appropriate category folder
2. Define tool schema with `Tool` type
3. Implement handler function
4. Export both tool and handler
5. Import and register in `src/index.ts`
6. Add tests in `test/ut/tools.test.ts`

### Adding a New Resource

1. Add resource definition to `src/resources/index.ts`
2. Update `handleReadResource` with new URI handler
3. Add tests in `test/ut/resources.test.ts`

### Adding a New Prompt

1. Add prompt definition to `src/prompts/index.ts`
2. Update `handleGetPrompt` with new prompt handler
3. Add tests in `test/ut/prompts.test.ts`

## Performance Considerations

- **Caching**: Resources could be cached to reduce API calls
- **Rate Limiting**: Be mindful of RevolutX API rate limits
- **Async Operations**: All API calls are asynchronous
- **Error Recovery**: Graceful degradation on API failures

## Future Enhancements

Potential improvements:
- Add caching layer for resources
- Implement rate limiting
- Add more comprehensive logging
- Support for webhooks/streaming data
- Additional resources for market data
- More sophisticated error recovery

## Next Steps

- See [Tools Reference](tools.md) for available tools
- Check [Examples](examples.md) for usage patterns
- Review [Troubleshooting](troubleshooting.md) for common issues
