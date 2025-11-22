import axios from "axios";

const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";

async function testLastTrades() {
    try {
        console.log(`Testing connection to ${REVOLUTX_API_URL}/public/last-trades...`);
        const response = await axios.get(`${REVOLUTX_API_URL}/public/last-trades`, {
            headers: {
                "Accept": "application/json",
            },
        });

        console.log("Success! Last trades retrieved:");
        // Log only the first trade to keep output clean
        if (response.data.data && response.data.data.length > 0) {
            console.log("First trade:", JSON.stringify(response.data.data[0], null, 2));
            console.log(`Total trades retrieved: ${response.data.data.length}`);
        } else {
            console.log("No trades found.");
        }
        console.log("Metadata:", JSON.stringify(response.data.metadata, null, 2));

    } catch (error: any) {
        console.error("Error fetching last trades:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
}

testLastTrades();
