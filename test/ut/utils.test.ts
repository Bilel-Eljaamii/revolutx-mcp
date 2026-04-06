import axios from "axios";
import crypto from "crypto";
import { 
  handleAxiosError, 
  checkApiKey, 
  getAuthHeaders 
} from "../../src/utils";

describe("Utils", () => {
    const originalEnv = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { 
          ...originalEnv,
          REVOLUTX_API_KEY: "mock_api_key",
          REVOLUTX_PRIVATE_KEY: "MC4CAQAwBQYDK2VwBCIEIByfG5v2vVn0n7m4E1H5R9U5D4F5E6G7H8I9J0K1L2M3"
        };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAuthHeaders", () => {
    const mockPrivateKey = "MC4CAQAwBQYDK2VwBCIEIByfG5v2vVn0n7m4E1H5R9U5D4F5E6G7H8I9J0K1L2M3"; // Example raw key data

    test("generates auth headers correctly", () => {
      // Mock crypto.sign
      const signSpy = jest.spyOn(crypto, "sign").mockReturnValue(Buffer.from("signed_signature") as any);

      const headers = getAuthHeaders("POST", "/api/1.0/orders", '{"qty":1}');

      expect(headers).toHaveProperty("X-Revx-API-Key", "mock_api_key");
      expect(headers).toHaveProperty("X-Revx-Timestamp");
      expect(headers).toHaveProperty("X-Revx-Signature");
      expect(typeof headers["X-Revx-Signature"]).toBe("string");
      
      signSpy.mockRestore();
    });

    test("throws error if private key is missing", () => {
      delete process.env.REVOLUTX_PRIVATE_KEY;
      expect(() => getAuthHeaders("GET", "/path")).toThrow("REVOLUTX_PRIVATE_KEY is not set");
    });
  });

  describe("handleAxiosError", () => {
    test("handles Axios error with response", () => {
      const axiosError = {
        message: "Request failed",
        isAxiosError: true,
        response: {
          status: 404,
          data: { error: "Not found" },
        },
      };

      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "fetching data");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error fetching data");
      expect(result.content[0].text).toContain("Request failed");
      expect(result.content[0].text).toContain("Status: 404");
      expect(result.content[0].text).toContain("Not found");
    });

    test("handles non-Axios Error instance", () => {
      const genericError = new Error("Something went wrong");
      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const result = handleAxiosError(genericError, "processing");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error processing");
      expect(result.content[0].text).toContain("Something went wrong");
    });

    test("handles 401 Unauthorized", () => {
      const axiosError = {
        message: "Unauthorized",
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: "Invalid key" },
        },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "fetching data");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Unauthorized: Your API key is invalid or expired.");
    });
  });

  describe("checkApiKey", () => {
    test("returns error when API key is missing", () => {
      delete process.env.REVOLUTX_API_KEY;
      const result = checkApiKey();
      expect(result?.isError).toBe(true);
      expect(result?.content[0].text).toContain("REVOLUTX_API_KEY");
    });

    test("returns error when private key is missing", () => {
      delete process.env.REVOLUTX_PRIVATE_KEY;
      const result = checkApiKey();
      expect(result?.isError).toBe(true);
      expect(result?.content[0].text).toContain("REVOLUTX_PRIVATE_KEY");
    });

    test("returns null when both keys are present", () => {
      const result = checkApiKey();
      expect(result).toBeNull();
    });
  });
});
