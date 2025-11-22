import axios from "axios";
import { handleReadResource } from "../../src/resources/index";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("RevolutX MCP Resources", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("revolutx://pairs returns correct data", async () => {
        const mockData = { "BTC/USD": { base: "BTC", quote: "USD" } };
        mockedAxios.get.mockResolvedValue({ data: mockData });

        const result = await handleReadResource("revolutx://pairs");

        expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("/configuration/pairs"), expect.any(Object));
        expect(result.contents[0].uri).toBe("revolutx://pairs");
        expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
    });

    test("throws error for unknown resource", async () => {
        await expect(handleReadResource("revolutx://unknown")).rejects.toThrow("Resource not found");
    });
});
