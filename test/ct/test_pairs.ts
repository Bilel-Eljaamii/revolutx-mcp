import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.REVOLUTX_API_KEY;
const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";

if (!API_KEY) {
    console.error("REVOLUTX_API_KEY environment variable is required for this test");
    process.exit(1);
}

async function testPairs() {
    try {
        console.log(`Testing connection to ${REVOLUTX_API_URL}/configuration/pairs...`);
        const response = await axios.get(`${REVOLUTX_API_URL}/configuration/pairs`, {
            headers: {
                "Accept": "application/json",
                "X-API-KEY": API_KEY,
            },
        });

        console.log("Success! Pairs retrieved:");
        // Log just a few keys to verify
        const keys = Object.keys(response.data);
        console.log(`Total pairs: ${keys.length}`);
        if (keys.length > 0) {
            const firstKey = keys[0];
            console.log(`Sample (${firstKey}):`, JSON.stringify(response.data[firstKey], null, 2));
        }
    } catch (error: any) {
        console.error("Error fetching pairs:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
}

testPairs();
