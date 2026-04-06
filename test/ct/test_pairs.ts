import axios from "axios";
import dotenv from "dotenv";
import { 
  REVOLUTX_API_URL, 
  getAuthHeaders 
} from "../src/utils.js";

dotenv.config();

async function testPairs() {
  const path = "/api/1.0/configuration/pairs";
  try {
    const response = await axios.get(`${REVOLUTX_API_URL}/configuration/pairs`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeaders("GET", path),
      },
    });

    console.log("Success! Pairs retrieved:");
    console.log(JSON.stringify(response.data, null, 2));
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
