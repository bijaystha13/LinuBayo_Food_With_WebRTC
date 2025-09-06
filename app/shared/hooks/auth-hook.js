// app/shared/hooks/auth-hook.js
"use client";

import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Updated login function to match your AuthPage expectations
  const login = useCallback((authData) => {
    let uid, authToken, userRole, expirationDate;

    // Handle both old pattern (uid, token, role, expirationDate) and new pattern ({ token, userId, role })
    if (typeof authData === "object" && authData.token) {
      // New pattern from AuthPage
      uid = authData.userId;
      authToken = authData.token;
      userRole = authData.role || "user";
      expirationDate = authData.expirationDate
        ? new Date(authData.expirationDate)
        : null;
    } else {
      // Old pattern (fallback)
      uid = arguments[0];
      authToken = arguments[1];
      userRole = arguments[2] || "user";
      expirationDate = arguments[3];
    }

    setToken(authToken);
    setUserId(uid);
    setRole(userRole);

    // Calculate expiration date - 1 hour from now if not provided
    const tokenExpDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: authToken,
        role: userRole,
        expiration: tokenExpDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole(null);
    localStorage.removeItem("userData");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  // Auto logout when token expires
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      if (remainingTime > 0) {
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        logout(); // Token already expired
      }
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // Check for existing auth data on mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      // Check if expiration date exists and is valid
      const expirationDate = storedData.expiration
        ? new Date(storedData.expiration)
        : new Date(new Date().getTime() + 1000 * 60 * 60); // Default to 1 hour if missing

      if (!storedData.expiration || expirationDate > new Date()) {
        login({
          userId: storedData.userId,
          token: storedData.token,
          role: storedData.role || "user",
          expirationDate: expirationDate,
        });
      } else {
        logout(); // Token expired
      }
    }
    setIsLoading(false); // Set loading to false after checking
  }, [login, logout]);

  // Computed properties for easier usage
  const isLoggedIn = !!token;

  return {
    token,
    login,
    logout,
    userId,
    role,
    isLoggedIn,
    isLoading,
  };
};
