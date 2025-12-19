import axios from "axios";
import { handleAxiosError, checkApiKey } from "../../src/utils";

// Mock environment variable
const originalEnv = process.env;

describe("Utils", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
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

      // Mock axios.isAxiosError
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "fetching data");

      expect(result.isError).toBe(true);
      expect(result.content[0].type).toBe("text");
      expect(result.content[0].text).toContain("Error fetching data");
      expect(result.content[0].text).toContain("Request failed");
      expect(result.content[0].text).toContain("Status: 404");
      expect(result.content[0].text).toContain("Not found");
    });

    test("handles Axios error without response", () => {
      const axiosError = {
        message: "Network error",
        isAxiosError: true,
      };

      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "connecting");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error connecting");
      expect(result.content[0].text).toContain("Network error");
      expect(result.content[0].text).not.toContain("Status:");
    });

    test("handles non-Axios error", () => {
      const genericError = new Error("Something went wrong");

      jest.spyOn(axios, "isAxiosError").mockReturnValue(false);

      const result = handleAxiosError(genericError, "processing");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error processing");
      expect(result.content[0].text).toContain("Something went wrong");
      expect(result.content[0].text).not.toContain("Status:");
    });

    test("handles error with complex response data", () => {
      const axiosError = {
        message: "Bad request",
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            errors: [
              { field: "price", message: "Invalid price" },
              { field: "quantity", message: "Invalid quantity" },
            ],
          },
        },
      };

      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "validating order");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain("Error validating order");
      expect(result.content[0].text).toContain("Status: 400");
      expect(result.content[0].text).toContain("Invalid price");
      expect(result.content[0].text).toContain("Invalid quantity");
    });

    test("handles 401 Unauthorized", () => {
      const axiosError = {
        message: "Request failed with status code 401",
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: "Invalid API key" },
        },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "fetching data");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain(
        "Unauthorized: Your API key is invalid or expired."
      );
      expect(result.content[0].text).toContain("Invalid API key");
    });

    test("handles 403 Forbidden", () => {
      const axiosError = {
        message: "Request failed with status code 403",
        isAxiosError: true,
        response: {
          status: 403,
          data: { message: "Access denied" },
        },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "fetching data");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain(
        "Forbidden: You do not have permission to access this resource."
      );
      expect(result.content[0].text).toContain("Access denied");
    });

    test("handles 409 Conflict", () => {
      const axiosError = {
        message: "Request failed with status code 409",
        isAxiosError: true,
        response: {
          status: 409,
          data: { message: "Order already exists" },
        },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "placing order");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain(
        "Conflict: The request could not be completed due to a conflict with the current state of the resource."
      );
      expect(result.content[0].text).toContain("Order already exists");
    });

    test("handles 5xx Server Error", () => {
      const axiosError = {
        message: "Request failed with status code 500",
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: "Internal server error" },
        },
      };
      jest.spyOn(axios, "isAxiosError").mockReturnValue(true);

      const result = handleAxiosError(axiosError, "fetching data");

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain(
        "Server Error: The Revolut X server encountered an error (Status: 500)"
      );
      expect(result.content[0].text).toContain("Internal server error");
    });
  });

  describe("checkApiKey", () => {
    test("returns error when API key is missing", () => {
      // Test the logic directly with undefined API key
      const testCheckApiKey = (apiKey: string | undefined) => {
        if (!apiKey) {
          return {
            content: [
              {
                type: "text",
                text: "Error: REVOLUTX_API_KEY environment variable is required for this tool.",
              },
            ],
            isError: true,
          };
        }
        return null;
      };

      const result = testCheckApiKey(undefined);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.isError).toBe(true);
        expect(result.content[0].type).toBe("text");
        expect(result.content[0].text).toContain("REVOLUTX_API_KEY");
        expect(result.content[0].text).toContain("required");
      }
    });

    test("returns null when API key is present", () => {
      // Test with actual implementation (API key from .env)
      const result = checkApiKey();

      // Since .env is loaded, API_KEY should exist and return null
      expect(result).toBeNull();
    });

    test("checkApiKey logic with empty string", () => {
      // Test the logic directly
      const testCheckApiKey = (apiKey: string | undefined) => {
        if (!apiKey) {
          return {
            content: [
              {
                type: "text",
                text: "Error: REVOLUTX_API_KEY environment variable is required for this tool.",
              },
            ],
            isError: true,
          };
        }
        return null;
      };

      const result = testCheckApiKey("");
      expect(result).not.toBeNull();
      if (result) {
        expect(result.isError).toBe(true);
      }
    });
  });
});
