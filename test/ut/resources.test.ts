import axios from "axios";
import { handleReadResource } from "../../src/resources/index";
import { checkApiKey, getAuthHeaders } from "../../src/utils";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock utils
jest.mock("../../src/utils", () => ({
    __esModule: true,
    ...jest.requireActual("../../src/utils"),
    checkApiKey: jest.fn().mockReturnValue(null),
    getAuthHeaders: jest.fn().mockReturnValue({ "X-Sign": "mock" }),
}));

describe("RevolutX MCP Resources", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (checkApiKey as jest.Mock).mockReturnValue(null);
    });

    test("revolutx://pairs returns correct data", async () => {
        const mockData = { "BTC/USD": { base: "BTC", quote: "USD" } };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        const result = await handleReadResource("revolutx://pairs");

        expect(mockedAxios.get).toHaveBeenCalledWith(
            expect.stringContaining("/configuration/pairs"), 
            expect.objectContaining({
                headers: expect.objectContaining({
                    "X-Sign": "mock"
                })
            })
        );
        expect(result.contents[0].uri).toBe("revolutx://pairs");
        expect(JSON.parse(result.contents[0].text)).toEqual(mockData);
    });

    test("throws error when API key check fails", async () => {
        (checkApiKey as jest.Mock).mockReturnValueOnce({
            content: [{ type: "text", text: "API Key Required" }],
            isError: true
        });

        await expect(handleReadResource("revolutx://pairs")).rejects.toThrow("API Key Required");
    });

    test("throws error for unknown resource", async () => {
        await expect(handleReadResource("revolutx://unknown")).rejects.toThrow("Resource not found");
    });

    test("handles fetch errors gracefully", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Network Failure"));

        await expect(handleReadResource("revolutx://pairs")).rejects.toThrow("Failed to fetch pairs: Network Failure");
    });
});
