"use client";

import { useCallback, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      try {
        const defaultHeaders = {
          "Content-Type": "application/json",
          ...headers,
        };

        const response = await fetch(url, {
          method,
          body: body ? JSON.stringify(body) : null,
          headers: defaultHeaders,
        });

        if (!response.ok) {
          if (response.status >= 500) {
            throw new Error(
              `Server error: Backend server is experiencing issues (${response.status})`
            );
          } else if (response.status === 404) {
            throw new Error(`API endpoint not found: ${url}`);
          } else if (response.status === 401) {
            throw new Error(`Unauthorized access`);
          } else if (response.status === 403) {
            throw new Error(`Access forbidden`);
          } else if (response.status >= 400) {
            throw new Error(`Client error: ${response.status}`);
          } else {
            throw new Error(`HTTP error: ${response.status}`);
          }
        }

        // Try to parse JSON response
        let responseData;
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        setIsLoading(false);
        return responseData;
      } catch (error) {
        setIsLoading(false);

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
