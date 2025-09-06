// contexts/LoadingContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const startNavigation = (destination) => {
    setIsNavigating(true);
    setLoadingMessage(`Loading ${destination}...`);
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    setLoadingMessage("");
  };

  const startAuth = (type) => {
    setIsAuthenticating(true);
    setLoadingMessage(
      type === "signin" ? "Signing in..." : "Creating account..."
    );
  };

  const stopAuth = () => {
    setIsAuthenticating(false);
    setLoadingMessage("");
  };

  return (
    <LoadingContext.Provider
      value={{
        isNavigating,
        isAuthenticating,
        loadingMessage,
        startNavigation,
        stopNavigation,
        startAuth,
        stopAuth,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
