# Troubleshooting

This guide helps you resolve common issues with the RevolutX MCP Server.

## Installation Issues

### Node.js Version Error

**Problem**: Error about Node.js version when installing dependencies.

**Solution**:
```bash
# Check your Node.js version
node --version

# Should be v16 or higher
# If not, install a newer version from nodejs.org
```

---

### npm Install Fails

**Problem**: `npm install` fails with errors.

**Solutions**:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   npm install
   ```

2. **Delete node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check for permission issues**:
   ```bash
   # On Linux/Mac, you might need sudo
   sudo npm install
   ```

---

## Configuration Issues

### API Key Not Found

**Problem**: Error: "REVOLUTX_API_KEY is required"

**Solutions**:

1. **Check .env file exists**:
   ```bash
   ls -la .env
   ```

2. **Verify .env content**:
   ```bash
   cat .env
   # Should show: REVOLUTX_API_KEY=your_key_here
   ```

3. **Ensure no extra spaces**:
   ```env
   # Wrong:
   REVOLUTX_API_KEY = your_key_here
   
   # Correct:
   REVOLUTX_API_KEY=your_key_here
   ```

4. **Rebuild after changing .env**:
   ```bash
   npm run build
   ```

---

### Invalid API Key

**Problem**: API calls fail with authentication errors.

**Solutions**:

1. **Verify API key is correct**:
   - Check for typos
   - Ensure you copied the entire key
   - Verify key hasn't expired

2. **Test API key directly**:
   ```bash
   curl -H "X-API-KEY: your_key_here" \
        https://api.revolut.com/api/1.0/crypto/balances
   ```

3. **Generate new API key**:
   - Log into RevolutX
   - Generate a new API key
   - Update `.env` file

---

## Build Issues

### TypeScript Compilation Errors

**Problem**: `npm run build` fails with TypeScript errors.

**Solutions**:

1. **Check TypeScript version**:
   ```bash
   npx tsc --version
   # Should be 5.x
   ```

2. **Clean build**:
   ```bash
   rm -rf dist
   npm run build
   ```

3. **Reinstall dependencies**:
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

---

### Module Not Found Errors

**Problem**: Error: "Cannot find module 'xyz'"

**Solutions**:

1. **Ensure all dependencies installed**:
   ```bash
   npm install
   ```

2. **Check import paths**:
   - Use `.js` extension in imports (even for TypeScript files)
   - Example: `import { foo } from "./utils.js"`

3. **Verify tsconfig.json**:
   ```json
   {
     "compilerOptions": {
       "module": "ES2022",
       "moduleResolution": "node"
     }
   }
   ```

---

## Runtime Issues

### Server Won't Start

**Problem**: `npm start` fails or server crashes immediately.

**Solutions**:

1. **Check build completed**:
   ```bash
   npm run build
   ls dist/
   # Should see index.js and other files
   ```

2. **Check for port conflicts** (if applicable):
   ```bash
   # MCP uses stdio, but check anyway
   lsof -i :3000
   ```

3. **Run with debug logging**:
   ```bash
   NODE_ENV=development npm start
   ```

4. **Check for syntax errors**:
   ```bash
   node dist/index.js
   # Should show any runtime errors
   ```

---

### Tools Return Errors

**Problem**: All tools return errors when called.

**Solutions**:

1. **Verify API key is set**:
   ```bash
   echo $REVOLUTX_API_KEY
   # Should show your key
   ```

2. **Check network connectivity**:
   ```bash
   ping api.revolut.com
   ```

3. **Test API directly**:
   ```bash
   curl https://api.revolut.com/api/1.0/crypto/public/last-trades
   ```

4. **Check RevolutX API status**:
   - Visit RevolutX status page
   - Check for maintenance windows

---

## Test Issues

### Jest Tests Fail

**Problem**: `npm test` fails with module resolution errors.

**Known Issue**: Jest may have trouble resolving `.js` imports in TypeScript files.

**Workaround**:
```bash
# Run specific test files
npm test -- tools.test.ts

# Or skip problematic tests
npm test -- --testPathIgnorePatterns=resources.test.ts
```

**Proper Solution**:
Update `jest.config.js` to handle module resolution:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
```

---

### Component Tests Fail

**Problem**: Component tests (in `test/ct/`) fail.

**Solutions**:

1. **Ensure API key is set**:
   ```bash
   # Component tests need real API access
   cat .env
   ```

2. **Check API rate limits**:
   - Wait a few minutes between test runs
   - RevolutX may rate limit your API key

3. **Run tests individually**:
   ```bash
   npx tsx test/ct/test_integration.ts
   ```

---

## MCP Client Issues

### Claude Desktop Can't Find Server

**Problem**: Claude Desktop doesn't show the RevolutX server.

**Solutions**:

1. **Check config file location**:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Verify config syntax**:
   ```json
   {
     "mcpServers": {
       "revolutx": {
         "command": "node",
         "args": ["/absolute/path/to/revolutx-mcp/dist/index.js"],
         "env": {
           "REVOLUTX_API_KEY": "your_key_here"
         }
       }
     }
   }
   ```

3. **Use absolute paths**:
   ```bash
   # Get absolute path
   cd /path/to/revolutx-mcp
   pwd
   # Use this path in config
   ```

4. **Restart Claude Desktop**:
   - Completely quit Claude Desktop
   - Restart it
   - Check server list

---

### Server Connects But Tools Don't Work

**Problem**: Server appears in Claude but tools fail.

**Solutions**:

1. **Check server logs**:
   - Look for error messages in Claude Desktop logs
   - Check stderr output

2. **Verify build is up to date**:
   ```bash
   npm run build
   # Then restart Claude Desktop
   ```

3. **Test server directly**:
   ```bash
   node dist/index.js
   # Should start without errors
   ```

---

## API Issues

### Rate Limit Errors

**Problem**: "Rate limit exceeded" errors.

**Solutions**:

1. **Wait before retrying**:
   - RevolutX has rate limits
   - Wait 1-5 minutes between bursts of requests

2. **Reduce request frequency**:
   - Use prompts instead of individual tools (they're more efficient)
   - Cache data when possible

3. **Check API tier**:
   - Verify your API key's rate limit tier
   - Consider upgrading if needed

---

### Timeout Errors

**Problem**: Requests timeout.

**Solutions**:

1. **Check network connection**:
   ```bash
   ping api.revolut.com
   ```

2. **Increase timeout** (if needed):
   - Edit tool files to increase axios timeout
   - Default is usually 30 seconds

3. **Check RevolutX status**:
   - API might be experiencing issues
   - Check status page or support

---

## Data Issues

### Unexpected Response Format

**Problem**: Tool returns data in unexpected format.

**Solutions**:

1. **Check API version**:
   - RevolutX API might have changed
   - Check API documentation

2. **Update server**:
   ```bash
   git pull
   npm install
   npm run build
   ```

3. **Report issue**:
   - If API changed, open GitHub issue
   - Include error details

---

## Getting Help

If you can't resolve your issue:

1. **Check documentation**:
   - [Getting Started](getting-started.md)
   - [Architecture](architecture.md)
   - [Examples](examples.md)

2. **Search existing issues**:
   - Check GitHub issues
   - Someone might have had the same problem

3. **Open a new issue**:
   - Include error messages
   - Include steps to reproduce
   - Include your environment (OS, Node version, etc.)

4. **Provide context**:
   ```bash
   # Include this info in your issue
   node --version
   npm --version
   cat package.json | grep version
   ```

## Common Error Messages

### "Cannot find module '../utils.js'"

**Cause**: Jest module resolution issue

**Fix**: See [Jest Tests Fail](#jest-tests-fail) above

---

### "REVOLUTX_API_KEY is required"

**Cause**: API key not set or not loaded

**Fix**: See [API Key Not Found](#api-key-not-found) above

---

### "Failed to fetch"

**Cause**: Network or API issue

**Fix**: Check network, API status, and API key validity

---

### "Argument 'symbol' is required"

**Cause**: Missing required parameter

**Fix**: Provide all required parameters for the tool or prompt

---

## Prevention Tips

1. **Always build after changes**:
   ```bash
   npm run build
   ```

2. **Keep dependencies updated**:
   ```bash
   npm update
   ```

3. **Use version control**:
   ```bash
   git status
   # Commit working versions
   ```

4. **Test before deploying**:
   ```bash
   npm test
   npm run build
   ```

5. **Monitor API usage**:
   - Track your API calls
   - Stay within rate limits
