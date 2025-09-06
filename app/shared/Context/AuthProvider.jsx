"use client";
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check for existing auth data on mount
  useEffect(() => {
    const checkAuthState = () => {
      try {
        // Check if we're on the client side
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        const storedRole = localStorage.getItem("role");

        console.log("Reading from localStorage:", {
          token: storedToken,
          userId: storedUserId,
          role: storedRole,
        });

        // Validate that all required fields exist and are not empty
        if (
          storedToken &&
          storedToken !== "null" &&
          storedUserId &&
          storedUserId !== "null" &&
          storedRole &&
          storedRole !== "null"
        ) {
          setToken(storedToken);
          setUserId(storedUserId);
          setRole(storedRole);
          setIsLoggedIn(true);

          console.log("✅ User authenticated from localStorage");
        } else {
          // Clear any invalid or partial data
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("role");
          }
          setIsLoggedIn(false);
          console.log("❌ No valid auth data in localStorage");
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Use requestAnimationFrame to ensure this runs after component mount
    requestAnimationFrame(() => {
      checkAuthState();
    });
  }, []);

  // Add this to your AuthProvider, after the first useEffect
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "userId" || e.key === "role") {
        // Re-check auth state when storage changes
        const storedToken = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        const storedRole = localStorage.getItem("role");

        if (storedToken && storedUserId && storedRole) {
          setToken(storedToken);
          setUserId(storedUserId);
          setRole(storedRole);
          setIsLoggedIn(true);
        } else {
          setToken(null);
          setUserId(null);
          setRole(null);
          setIsLoggedIn(false);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, []);

  // Add this function to your AuthProvider
  const isTokenValid = (token) => {
    try {
      if (!token) return false;

      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  // Then update your checkAuthState function:
  const checkAuthState = () => {
    try {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      const storedRole = localStorage.getItem("role");

      console.log("Auth check:", { storedToken, storedUserId, storedRole });

      // Check if token exists and is valid
      if (
        storedToken &&
        storedUserId &&
        storedRole &&
        isTokenValid(storedToken)
      ) {
        setToken(storedToken);
        setUserId(storedUserId);
        setRole(storedRole);
        setIsLoggedIn(true);
        console.log("✅ Valid token, user logged in");
      } else {
        // Clear expired or invalid tokens
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
        }
        setIsLoggedIn(false);
        console.log("❌ Invalid or expired token");
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    const { token, userId, role = "user" } = userData;

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
      }

      setToken(token);
      setUserId(userId);
      setRole(role);
      setIsLoggedIn(true);
      setShowUserMenu(false);

      console.log("✅ Login successful:", { userId, role });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
      }

      setToken(null);
      setUserId(null);
      setRole(null);
      setIsLoggedIn(false);
      setShowUserMenu(false);

      console.log("✅ Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  const value = {
    isLoggedIn,
    userId,
    token,
    role,
    isLoading,
    showUserMenu,
    login,
    logout,
    toggleUserMenu,
    closeUserMenu,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
