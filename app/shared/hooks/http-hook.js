"use client";

import { useCallback, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      try {
        let defaultHeaders = {};
        let processedBody = body;

        // Only set Content-Type for non-FormData requests
        if (body && !(body instanceof FormData)) {
          defaultHeaders["Content-Type"] = "application/json";
          processedBody = JSON.stringify(body);
        } else if (body instanceof FormData) {
          // Don't set Content-Type for FormData - let browser set it with boundary
          processedBody = body;
        }

        // Merge with provided headers
        const finalHeaders = { ...defaultHeaders, ...headers };

        console.log("Making request to:", url, "with method:", method);
        console.log("Request body type:", body?.constructor.name);
        console.log("Final headers:", finalHeaders);

        const response = await fetch(url, {
          method,
          body: processedBody,
          headers: finalHeaders,
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          // First try to parse the response to get the actual error message
          let errorMessage = `HTTP error: ${response.status}`;
          let errorResponse = null;

          try {
            const responseText = await response.text();
            console.log("Raw error response text:", responseText);

            if (responseText) {
              errorResponse = JSON.parse(responseText);
              console.log("Parsed error response:", errorResponse);

              // Extract error message from backend response
              if (errorResponse.message) {
                errorMessage = errorResponse.message;
                console.log("Using errorResponse.message:", errorMessage);
              } else if (errorResponse.error) {
                errorMessage = errorResponse.error;
                console.log("Using errorResponse.error:", errorMessage);
              } else if (
                errorResponse.errors &&
                errorResponse.errors.length > 0
              ) {
                errorMessage =
                  errorResponse.errors[0].msg || errorResponse.errors[0];
                console.log("Using errorResponse.errors[0]:", errorMessage);
              }
            }
          } catch (parseError) {
            console.log("Failed to parse error response:", parseError);
            // If we can't parse JSON, use status-based messages
            if (response.status >= 500) {
              errorMessage = `Server error: Backend server is experiencing issues (${response.status})`;
            } else if (response.status === 404) {
              errorMessage = `API endpoint not found: ${url}`;
            } else if (response.status === 401) {
              errorMessage = `Unauthorized access`;
            } else if (response.status === 403) {
              errorMessage = `Access forbidden`;
            } else if (response.status >= 400) {
              errorMessage = `Client error: ${response.status}`;
            }
          }

          console.log("Final error message to throw:", errorMessage);

          // Create error with status code attached
          const error = new Error(errorMessage);
          error.status = response.status;
          error.response = errorResponse;
          throw error;
        }

        // Try to parse JSON response
        let responseData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        console.log("Success response data:", responseData);
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setIsLoading(false);

        console.log("Caught error in useHttpClient:", error);
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);
        console.log("Error status:", error.status);

        // Network errors (server down, no internet, CORS, etc.)
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          throw new Error(
            "Network error: Unable to connect to server. Please check if the backend server is running and accessible."
          );
        } else if (error.message.includes("Failed to fetch")) {
          throw new Error(
            "Network error: Backend server is unreachable. Please check your connection."
          );
        } else if (error.name === "AbortError") {
          throw new Error("Request was aborted or timed out");
        }

        throw error;
      }
    },
    []
  );

  return { isLoading, sendRequest };
};
