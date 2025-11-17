"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

import { AuthContext } from "./AuthContext";

let logoutTimer = null;

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const mountedRef = useRef(true);

  // Simple token validation - only check if token exists and has proper JWT format
  const isTokenValid = useCallback((token) => {
    try {
      if (!token) return { valid: false, expiresAt: null };

      const parts = token.split(".");
      if (parts.length !== 3) return { valid: false, expiresAt: null };

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      const expiresAt = new Date(payload.exp * 1000);

      return {
        valid: payload.exp > currentTime,
        expiresAt: expiresAt,
        timeUntilExpiry: payload.exp * 1000 - Date.now(),
      };
    } catch (error) {
      console.error("Token validation error:", error);
      return { valid: false, expiresAt: null };
    }
  }, []);

  // Enhanced logout function
  const logout = useCallback(() => {
    console.log("Logging out user - clearing all data");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
      logoutTimer = null;
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }

    if (mountedRef.current) {
      setToken(null);
      setUserId(null);
      setRole(null);
      setIsLoggedIn(false);
      setShowUserMenu(false);
      setTokenExpirationDate(null);
    }

    console.log("✅ Logout successful");

    router.push("/auth?mode=login");
  }, [router]);

  // Setup auto-logout timer
  const setupAutoLogout = useCallback(
    (expiresAt, timeUntilExpiry) => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }

      if (timeUntilExpiry <= 0) {
        console.log("Token already expired - logging out immediately");
        logout();
        return;
      }

      console.log("Setting up auto-logout:", {
        expiresAt: expiresAt.toISOString(),
        timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / (1000 * 60)),
      });

      logoutTimer = setTimeout(() => {
        console.log("Token expired - auto logout triggered");
        logout();
      }, timeUntilExpiry);
    },
    [logout]
  );

  // Enhanced login function
  const login = useCallback(
    (userData) => {
      const { token, userId, role = "user", expirationDate } = userData;

      try {
        // Calculate expiration date - use provided or default to 1 hour
        const tokenExpDate =
          expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

        if (typeof window !== "undefined") {
          // Store in the same format as the hook expects
          localStorage.setItem(
            "userData",
            JSON.stringify({
              userId: userId,
              token: token,
              role: role,
              expiration: tokenExpDate.toISOString(),
            })
          );
        }

        if (mountedRef.current) {
          setToken(token);
          setUserId(userId);
          setRole(role);
          setIsLoggedIn(true);
          setShowUserMenu(false);
          setTokenExpirationDate(tokenExpDate);
        }

        // Setup auto-logout using the calculated expiration
        const timeUntilExpiry = tokenExpDate.getTime() - Date.now();
        setupAutoLogout(tokenExpDate, timeUntilExpiry);

        console.log("✅ Login successful:", { userId, role });
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    [setupAutoLogout]
  );

  // Check for existing auth data on mount
  useEffect(() => {
    const checkAuthState = () => {
      try {
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        console.log("Checking for existing auth data...");
        const storedData = JSON.parse(localStorage.getItem("userData"));

        if (storedData && storedData.token) {
          console.log("Found stored auth data:", {
            userId: storedData.userId,
            role: storedData.role,
            expiration: storedData.expiration,
          });

          const expirationDate = storedData.expiration
            ? new Date(storedData.expiration)
            : new Date(new Date().getTime() + 1000 * 60 * 60);

          if (expirationDate > new Date()) {
            console.log("Stored token is valid - restoring session");

            if (mountedRef.current) {
              setToken(storedData.token);
              setUserId(storedData.userId);
              setRole(storedData.role || "user");
              setIsLoggedIn(true);
              setTokenExpirationDate(expirationDate);
            }

            // Setup auto-logout for existing token
            const timeUntilExpiry = expirationDate.getTime() - Date.now();
            setupAutoLogout(expirationDate, timeUntilExpiry);
          } else {
            console.log("Stored token is expired - clearing data");
            logout();
          }
        } else {
          console.log("No stored auth data found");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Small delay to ensure proper mounting
    const timeoutId = setTimeout(checkAuthState, 100);
    return () => clearTimeout(timeoutId);
  }, [logout, setupAutoLogout]);

  // Handle storage changes (multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userData") {
        console.log("Storage changed in another tab");

        if (!e.newValue) {
          console.log("Auth data removed in another tab - logging out");
          logout();
        } else {
          try {
            const newData = JSON.parse(e.newValue);
            const expirationDate = new Date(newData.expiration);

            if (expirationDate > new Date()) {
              console.log("Auth data updated in another tab - syncing");
              login({
                userId: newData.userId,
                token: newData.token,
                role: newData.role,
                expirationDate: expirationDate,
              });
            } else {
              console.log("Expired auth data detected in another tab");
              logout();
            }
          } catch (error) {
            console.error("Error parsing storage data:", error);
            logout();
          }
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [login, logout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }
    };
  }, []);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const closeUserMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  const value = {
    isLoggedIn,
    userId,
    token,
    role,
    isLoading,
    showUserMenu,
    tokenExpirationDate,
    login,
    logout,
    toggleUserMenu,
    closeUserMenu,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
