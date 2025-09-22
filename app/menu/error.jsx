"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./MenuError.module.css";

const MenuError = ({ error, reset }) => {
  const [errorType, setErrorType] = useState("general");
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkRetryCount, setNetworkRetryCount] = useState(0);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("Network: Back online");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Network: Went offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Determine specific menu-related error types
    if (
      error?.isNetworkError ||
      error?.name === "NetworkError" ||
      !navigator.onLine ||
      error?.message?.toLowerCase().includes("network") ||
      error?.message?.toLowerCase().includes("connection") ||
      error?.message?.includes("Failed to fetch")
    ) {
      setErrorType("network");
    } else if (
      error?.message?.includes("menu") ||
      error?.message?.includes("products")
    ) {
      setErrorType("menuLoad");
    } else if (
      error?.message?.includes("search") ||
      error?.message?.includes("filter")
    ) {
      setErrorType("search");
    } else if (
      error?.message?.includes("category") ||
      error?.message?.includes("categories")
    ) {
      setErrorType("category");
    } else if (
      error?.message?.includes("api") ||
      error?.message?.includes("fetch")
    ) {
      setErrorType("api");
    } else if (
      error?.message?.includes("database") ||
      error?.message?.includes("db")
    ) {
      setErrorType("database");
    } else if (error?.message?.includes("timeout")) {
      setErrorType("timeout");
    } else {
      setErrorType("general");
    }

    // Log menu-specific error
    console.error("Menu page error:", error);
  }, [error]);

  // Network connectivity check
  const checkNetworkConnectivity = async () => {
    try {
      if (!navigator.onLine) {
        return false;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/favicon.ico", {
        method: "HEAD",
        cache: "no-cache",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);

    if (errorType === "network") {
      setNetworkRetryCount((prev) => prev + 1);

      // Check network connectivity before retrying
      const isConnected = await checkNetworkConnectivity();
      if (!isConnected) {
        setIsRetrying(false);
        return; // Don't reset if still no connection
      }
    }

    setRetryCount((prev) => prev + 1);

    // Progressive delay based on retry count
    const delay = Math.min(1000 + retryCount * 500, 3000);

    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, delay);
  };

  const getMenuErrorContent = () => {
    switch (errorType) {
      case "network":
        return {
          icon: "📶",
          title: "No Internet Connection",
          description: isOnline
            ? "Your device appears connected, but we can't reach our servers. Please check your internet connection and try again."
            : "You're currently offline. Please check your internet connection to access our delicious menu.",
          code: "NETWORK_ERROR",
          suggestions: [
            "📶 Check your WiFi or mobile data",
            "🔄 Try refreshing the page",
            "⏳ Wait for connection to restore",
            "📞 Call us to place your order",
            "🏠 Visit our physical location",
          ],
        };
      case "menuLoad":
        return {
          icon: "🍽️",
          title: "Menu Loading Failed",
          description:
            "We're having trouble loading our delicious menu items. Our kitchen database might be temporarily unavailable.",
          code: "MENU_ERROR",
          suggestions: [
            "🔄 Try refreshing the menu",
            "⏳ Wait a moment and reload",
            "🏠 Browse our homepage instead",
            "🔍 Try searching for specific items",
          ],
        };
      case "search":
        return {
          icon: "🔍",
          title: "Search System Error",
          description:
            "The search functionality is currently experiencing issues. We can't find what you're looking for right now.",
          code: "SEARCH_ERROR",
          suggestions: [
            "🗂️ Browse categories instead",
            "🔄 Clear search and try again",
            "🏠 Go to homepage",
            "📞 Contact us for help",
          ],
        };
      case "category":
        return {
          icon: "📂",
          title: "Category Loading Error",
          description:
            "We're having trouble organizing our menu categories. The kitchen's filing system seems to be mixed up!",
          code: "CATEGORY_ERROR",
          suggestions: [
            "🔄 Refresh the page",
            "🍽️ View all menu items",
            "🔍 Use search instead",
            "🏠 Return to homepage",
          ],
        };
      case "api":
        return {
          icon: "🔌",
          title: "Kitchen Connection Lost",
          description:
            "We've lost connection to our kitchen's ordering system. The chefs are working to reconnect everything.",
          code: "API_ERROR",
          suggestions: [
            "🔄 Retry the connection",
            "⏳ Wait and try again",
            "📞 Call for phone orders",
            "🏠 Visit our homepage",
          ],
        };
      case "database":
        return {
          icon: "🗃️",
          title: "Recipe Database Offline",
          description:
            "Our recipe database is temporarily offline. We can't access our menu items and ingredients right now.",
          code: "DB_ERROR",
          suggestions: [
            "⏳ Try again in a few minutes",
            "📞 Call to place your order",
            "🏠 Browse our homepage",
            "📧 Contact customer support",
          ],
        };
      case "timeout":
        return {
          icon: "⏱️",
          title: "Menu Request Timeout",
          description:
            "The menu is taking too long to load. Our servers might be busy preparing orders for other customers.",
          code: "TIMEOUT_ERROR",
          suggestions: [
            "🔄 Try loading again",
            "⏳ Wait and refresh",
            "🏠 Go to homepage",
            "📞 Place order by phone",
          ],
        };
      default:
        return {
          icon: "🍴",
          title: "Menu System Error",
          description:
            "Something unexpected happened while loading the menu. Don't worry, our chefs are still cooking!",
          code: "MENU_SYSTEM_ERROR",
          suggestions: [
            "🔄 Refresh the menu",
            "🏠 Go to homepage",
            "📞 Contact support",
            "⏳ Try again later",
          ],
        };
    }
  };

  const errorContent = getMenuErrorContent();

  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.floatingUtensil}>🍴</div>
        <div className={styles.floatingUtensil}>🥄</div>
        <div className={styles.floatingUtensil}>🔪</div>
        <div className={styles.floatingUtensil}>🍳</div>
        <div className={styles.floatingUtensil}>👨‍🍳</div>
        <div className={styles.floatingUtensil}>📋</div>
        <div className={styles.menuWave}></div>
        <div className={styles.menuWave}></div>
        <div className={styles.menuWave}></div>
      </div>

      <div className={styles.content}>
        {/* Network status indicator */}
        {errorType === "network" && (
          <div className={styles.networkStatus}>
            <div
              className={`${styles.connectionIndicator} ${
                isOnline ? styles.online : styles.offline
              }`}
            >
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>
                {isOnline ? "Device Online" : "Device Offline"}
              </span>
            </div>
          </div>
        )}

        <div className={styles.errorHeader}>
          <div className={styles.errorIcon}>{errorContent.icon}</div>
          <div className={styles.errorBadge}>
            <div className={styles.errorCode}>{errorContent.code}</div>
            <div className={styles.retryCounter}>
              Attempt:{" "}
              {errorType === "network" ? networkRetryCount + 1 : retryCount + 1}
            </div>
          </div>
        </div>

        <div className={styles.brokenMenu}>
          <div className={styles.menuPage}>📋</div>
          <div className={styles.menuTear}></div>
          <div className={styles.menuPage2}>📄</div>
          <div className={styles.errorSparks}>
            <span>✨</span>
            <span>💥</span>
            <span>⚡</span>
          </div>
        </div>

        <h1 className={styles.title}>{errorContent.title}</h1>
        <p className={styles.description}>{errorContent.description}</p>

        {/* Network-specific additional info */}
        {errorType === "network" && (
          <div className={styles.networkInfo}>
            <div className={styles.networkStats}>
              <div className={styles.networkStat}>
                <span className={styles.networkIcon}>📊</span>
                <span>Connection: {isOnline ? "Online" : "Offline"}</span>
              </div>
              <div className={styles.networkStat}>
                <span className={styles.networkIcon}>🔄</span>
                <span>Network Retries: {networkRetryCount}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.errorStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {errorType === "network" ? networkRetryCount : retryCount}
            </div>
            <div className={styles.statLabel}>Retry Attempts</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{errorType.toUpperCase()}</div>
            <div className={styles.statLabel}>Error Type</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              {new Date().toLocaleTimeString()}
            </div>
            <div className={styles.statLabel}>Error Time</div>
          </div>
        </div>

        <div className={styles.errorDetails}>
          <details className={styles.technicalDetails}>
            <summary>Technical Information</summary>
            <div className={styles.errorInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Error Message:</span>
                <span className={styles.infoValue}>
                  {error?.message || "Unknown menu error"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Component:</span>
                <span className={styles.infoValue}>Menu Page</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Network Status:</span>
                <span className={styles.infoValue}>
                  {isOnline ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Timestamp:</span>
                <span className={styles.infoValue}>
                  {new Date().toISOString()}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Error ID:</span>
                <span className={styles.infoValue}>
                  MENU_
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
              {error?.digest && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Digest:</span>
                  <span className={styles.infoValue}>{error.digest}</span>
                </div>
              )}
            </div>
          </details>
        </div>

        <div className={styles.quickActions}>
          <h3 className={styles.actionsTitle}>Quick Solutions:</h3>
          <div className={styles.actionsList}>
            {errorContent.suggestions.map((suggestion, index) => (
              <div key={index} className={styles.actionItem}>
                {suggestion}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleRetry}
            className={`${styles.primaryBtn} ${
              isRetrying ? styles.retrying : ""
            } ${errorType === "network" && !isOnline ? styles.disabled : ""}`}
            disabled={isRetrying || (errorType === "network" && !isOnline)}
          >
            <span className={styles.btnIcon}>{isRetrying ? "🔄" : "🔄"}</span>
            {isRetrying
              ? `Retrying... (${Math.ceil((1000 + retryCount * 500) / 1000)}s)`
              : errorType === "network" && !isOnline
              ? "Waiting for Connection..."
              : "Reload Menu"}
          </button>
          <Link href="/menu" className={styles.secondaryBtn}>
            <span className={styles.btnIcon}>🍽️</span>
            Fresh Menu
          </Link>
          <Link href="/" className={styles.tertiaryBtn}>
            <span className={styles.btnIcon}>🏠</span>
            Homepage
          </Link>
          <Link href="/contact" className={styles.quaternaryBtn}>
            <span className={styles.btnIcon}>📞</span>
            Get Help
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerStats}>
          <p>
            Kitchen Status:{" "}
            <span className={styles.statusBadge}>
              {errorType === "network"
                ? "Connection Issues"
                : "Under Maintenance"}
            </span>
          </p>
          <p>
            Menu Error ID: MENU_
            {Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
          {errorType === "network" && (
            <p>
              Network Status:
              <span
                className={`${styles.networkBadge} ${
                  isOnline ? styles.online : styles.offline
                }`}
              >
                {isOnline ? "🟢 Connected" : "🔴 Disconnected"}
              </span>
            </p>
          )}
        </div>
        <p>
          {errorType === "network"
            ? "Please check your internet connection. Our kitchen is ready when you are!"
            : "Our digital kitchen is experiencing technical difficulties, but our real kitchen is still cooking!"}
        </p>
      </div>
    </div>
  );
};

export default MenuError;
