import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.REVOLUTX_API_KEY;
const REVOLUTX_API_URL = "https://revx.revolut.com/api/1.0";

if (!API_KEY) {
    console.error("REVOLUTX_API_KEY environment variable is required");
    process.exit(1);
}

async function testBalances() {
    try {
        console.log(`Testing connection to ${REVOLUTX_API_URL}/balances...`);
        const response = await axios.get(`${REVOLUTX_API_URL}/balances`, {
            headers: {
                "Accept": "application/json",
                "X-API-KEY": API_KEY,
            },
        });

        console.log("Success! Balances retrieved:");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
        console.error("Error fetching balances:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
}

testBalances();
