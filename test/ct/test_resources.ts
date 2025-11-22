import { handleReadResource } from "../../src/resources/index.js";
import dotenv from "dotenv";

dotenv.config();

async function testResources() {
    console.log("Testing Resources...");

    try {
        console.log("Reading revolutx://pairs...");
        const result = await handleReadResource("revolutx://pairs");
        console.log("Success! Resource content length:", result.contents[0].text.length);
        // Parse to verify JSON
        JSON.parse(result.contents[0].text);
        console.log("Valid JSON received.");
    } catch (error: any) {
        console.error("Error testing resources:", error.message);
        process.exit(1);
    }
}

testResources();
