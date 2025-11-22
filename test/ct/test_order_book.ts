import axios from "axios";

const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";

async function testOrderBook(symbol: string) {
    try {
        console.log(`Testing connection to ${REVOLUTX_API_URL}/public/order-book/${symbol}...`);
        const response = await axios.get(`${REVOLUTX_API_URL}/public/order-book/${symbol}`, {
            headers: {
                "Accept": "application/json",
            },
        });

        console.log(`Success! Order book for ${symbol} retrieved:`);
        console.log("Asks (first 2):", JSON.stringify(response.data.data.asks.slice(0, 2), null, 2));
        console.log("Bids (first 2):", JSON.stringify(response.data.data.bids.slice(0, 2), null, 2));
        console.log("Metadata:", JSON.stringify(response.data.metadata, null, 2));

    } catch (error: any) {
        console.error(`Error fetching order book for ${symbol}:`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
}

// Test with BTC-USD and ETH-USD
testOrderBook("BTC-USD");
