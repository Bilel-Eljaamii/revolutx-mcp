import axios from "axios";
import dotenv from "dotenv";
import { 
  REVOLUTX_API_URL, 
  getApiKey, 
  getPrivateKey, 
  getAuthHeaders 
} from "../src/utils.js";

dotenv.config();

const apiKey = getApiKey();
const privateKey = getPrivateKey();

if (!apiKey || !privateKey) {
  console.error("REVOLUTX_API_KEY and REVOLUTX_PRIVATE_KEY environment variables are required");
  process.exit(1);
}

async function testBalances() {
  try {
    const path = "/api/1.0/balances";
    console.log(`Testing signed connection to ${REVOLUTX_API_URL}/balances...`);
    
    const response = await axios.get(`${REVOLUTX_API_URL}/balances`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeaders("GET", path),
      },
    });

    console.log("Success! Balances retrieved:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: unknown) {
    console.error("Error fetching balances:");
    if (axios.isAxiosError(error) && error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
  }
}

testBalances();
