"use client";

import { useCallback, useEffect, useState } from "react";
import {
  WifiOff,
  Wifi,
  AlertCircle,
  User,
  Settings,
  RefreshCw,
  Home,
  Phone,
  Server,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import styles from "./Error.module.css";

const GlobalError = ({ error, reset }) => {
  const [errorType, setErrorType] = useState("general");
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);
  }, []);

  // Check online status
  useEffect(() => {
    if (!mounted) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [mounted]);

  // Determine error type based on error message
  useEffect(() => {
    if (!error) return;

    const message = error.message || "";

    if (
      message.includes("Network error") ||
      message.includes("Failed to fetch") ||
      message.includes("internet connection") ||
      message.includes("fetch")
    ) {
      setErrorType("network");
    } else if (
      message.includes("Server error") ||
      message.includes("500") ||
      message.includes("backend") ||
      message.includes("Backend server")
    ) {
      setErrorType("server");
    } else if (
      message.includes("Unauthorized") ||
      message.includes("401") ||
      message.includes("Authentication") ||
      message.includes("session")
    ) {
      setErrorType("auth");
    } else if (
      message.includes("API endpoint not found") ||
      message.includes("404")
    ) {
      setErrorType("config");
    } else {
      setErrorType("general");
    }
  }, [error]);

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case "network":
        return <WifiOff className={styles.errorIcon} />;
      case "server":
        return <Server className={styles.errorIcon} />;
      case "auth":
        return <Shield className={styles.errorIcon} />;
      case "config":
        return <Settings className={styles.errorIcon} />;
      default:
        return <AlertCircle className={styles.errorIcon} />;
    }
  };

  const getErrorContent = () => {
    const message = error?.message || "An unexpected error occurred";

    switch (errorType) {
      case "network":
        return {
          title: "Connection Lost",
          message: !navigator.onLine
            ? "No internet connection detected. Please check your network and try again."
            : message.includes("internet connection")
            ? message
            : "Unable to reach our servers. Please check if the backend server is running and accessible.",
          emoji: "🌐",
          suggestions: [
            "Check your internet connection",
            "Ensure the backend server is running (localhost:5001)",
            "Try refreshing the page",
            "Wait a moment and try again",
          ],
        };
      case "server":
        return {
          title: "Server Unavailable",
          message:
            message.includes("Server error") ||
            message.includes("Backend server")
              ? message
              : "Our servers are experiencing issues. Our team has been notified and is working on a fix.",
          emoji: "🔧",
          suggestions: [
            "Wait a few minutes and try again",
            "If running locally, check your backend server",
            "Run: npm run dev or node server.js",
            "Check server logs for errors",
          ],
        };
      case "auth":
        return {
          title: "Authentication Required",
          message:
            message.includes("session") || message.includes("Authentication")
              ? message
              : "Your session has expired. Please sign in again to continue.",
          emoji: "🔐",
          suggestions: [
            "Click 'Go to Login' below",
            "Sign in with your credentials",
            "Clear browser cookies if issues persist",
            "Contact support if you can't access your account",
          ],
        };
      case "config":
        return {
          title: "Service Configuration Error",
          message:
            "API endpoint not found. There seems to be a configuration issue with our services.",
          emoji: "⚙️",
          suggestions: [
            "Check API endpoint URLs",
            "Verify backend routes are set up correctly",
            "Ensure backend server is running on the correct port",
            "Check network configuration",
          ],
        };
      default:
        return {
          title: "Something Unexpected Happened",
          message:
            message ||
            "We encountered an unexpected error. Don't worry, our team has been notified.",
          emoji: "⚠️",
          suggestions: [
            "Try refreshing the page",
            "Check your internet connection",
            "Wait a moment and try again",
            "Contact support if the issue persists",
          ],
        };
    }
  };

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);

    // Add delay for better UX
    setTimeout(() => {
      if (reset) {
        reset();
      } else {
        window.location.reload();
      }
      setIsRetrying(false);
    }, 1500);
  }, [reset]);

  const handleGoToLogin = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const errorContent = getErrorContent();

  return (
    <div className={styles.errorContainer}>
      {/* Simplified background elements */}
      <div className={styles.backgroundElements}>
        <div
          className={styles.liquidBubble}
          style={{ top: "15%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className={styles.liquidBubble}
          style={{ top: "25%", right: "15%", animationDelay: "2s" }}
        ></div>
        <div
          className={styles.liquidBubble}
          style={{ bottom: "35%", left: "20%", animationDelay: "4s" }}
        ></div>
      </div>

      <div className={styles.errorContent}>
        <div className={styles.errorHeader}>
          <div className={styles.errorIconContainer}>
            {getErrorIcon(errorType)}
            {/* <div className={styles.errorEmoji}>{errorContent.emoji}</div> */}
          </div>
          <h1
            className={`${styles.errorTitle} ${
              errorType === "general" ? styles.animatedTitle : ""
            }`}
          >
            {errorContent.title}
          </h1>
          <p className={styles.errorMessage}>{errorContent.message}</p>
        </div>

        <div className={styles.errorActions}>
          {errorType === "network" && (
            <div className={styles.networkStatus}>
              <div
                className={`${styles.statusIndicator} ${
                  isOnline ? styles.online : styles.offline
                }`}
              >
                {isOnline ? (
                  <Wifi className={styles.statusIcon} />
                ) : (
                  <WifiOff className={styles.statusIcon} />
                )}
                <span>{isOnline ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleRetry}
            className={`${styles.retryButton} ${
              isRetrying ? styles.retrying : ""
            }`}
            disabled={isRetrying || (!isOnline && errorType === "network")}
          >
            <div className={styles.liquidEffect}></div>
            <RefreshCw
              className={`${styles.buttonIcon} ${
                isRetrying ? styles.spinning : ""
              }`}
            />
            <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
          </button>

          {errorType === "server" && (
            <div className={styles.serverHelp}>
              <div className={styles.serverHelpIcon}>
                <Zap size={18} />
              </div>
              <div className={styles.serverHelpContent}>
                <p>
                  If running locally, ensure your backend server is started:
                </p>
                <div className={styles.codeBlock}>
                  <code>npm run dev</code>
                  <span className={styles.codeOr}>or</span>
                  <code>node server.js</code>
                </div>
              </div>
            </div>
          )}

          <div className={styles.suggestions}>
            <h4>What you can try:</h4>
            <ul>
              {errorContent.suggestions.map((suggestion, index) => (
                <li key={index} className={styles.suggestionItem}>
                  <div className={styles.suggestionBullet}></div>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actionButtons}>
            {errorType === "auth" ? (
              <button onClick={handleGoToLogin} className={styles.loginButton}>
                <div className={styles.liquidEffect}></div>
                <User className={styles.buttonIcon} />
                <span>Go to Login</span>
              </button>
            ) : (
              <button onClick={handleGoHome} className={styles.secondaryButton}>
                <div className={styles.liquidEffect}></div>
                <Home className={styles.buttonIcon} />
                <span>Go Home</span>
              </button>
            )}

            <button
              onClick={() => (window.location.href = "/contact")}
              className={styles.secondaryButton}
            >
              <div className={styles.liquidEffect}></div>
              <Phone className={styles.buttonIcon} />
              <span>Get Help</span>
            </button>
          </div>
        </div>

        <div className={styles.errorFooter}>
          <p>Error ID: {Math.random().toString(36).substring(2, 15)}</p>
          <p>Our technical team has been automatically notified!</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
