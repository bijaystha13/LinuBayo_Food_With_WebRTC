"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Error.module.css";

const GlobalError = ({ error, reset }) => {
  const [errorType, setErrorType] = useState("general");
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Determine error type based on error message or network status
    if (
      error?.message?.includes("fetch") ||
      error?.message?.includes("network")
    ) {
      setErrorType("network");
    } else if (
      error?.message?.includes("500") ||
      error?.message?.includes("server")
    ) {
      setErrorType("server");
    } else if (
      error?.message?.includes("database") ||
      error?.message?.includes("connection")
    ) {
      setErrorType("database");
    } else if (error?.message?.includes("timeout")) {
      setErrorType("timeout");
    } else {
      setErrorType("general");
    }

    // Log error for debugging
    console.error("Global error:", error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);

    // Add a small delay for better UX
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 1500);
  };

  const getErrorContent = () => {
    switch (errorType) {
      case "network":
        return {
          icon: "🌐",
          title: "Connection Lost",
          description:
            "Unable to connect to our servers. Please check your internet connection and try again.",
          code: "NET_ERROR",
        };
      case "server":
        return {
          icon: "🔧",
          title: "Server Error",
          description:
            "Our kitchen servers are having trouble. Our chefs are working to fix this issue.",
          code: "500 ERROR",
        };
      case "database":
        return {
          icon: "🗄️",
          title: "Database Issue",
          description:
            "We're having trouble accessing our recipe database. Please try again in a moment.",
          code: "DB_ERROR",
        };
      case "timeout":
        return {
          icon: "⏱️",
          title: "Request Timeout",
          description:
            "The request took too long to complete. Our servers might be busy serving other customers.",
          code: "TIMEOUT",
        };
      default:
        return {
          icon: "⚠️",
          title: "Something Went Wrong",
          description:
            "An unexpected error occurred while preparing your order. Don't worry, we're on it!",
          code: "GENERAL_ERROR",
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.floatingFood}>🍕</div>
        <div className={styles.floatingFood}>🍔</div>
        <div className={styles.floatingFood}>🍜</div>
        <div className={styles.floatingFood}>🥗</div>
        <div className={styles.floatingFood}>🍰</div>
        <div className={styles.floatingFood}>🍳</div>
        <div className={styles.errorWave}></div>
        <div className={styles.errorWave}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.errorHeader}>
          <div className={styles.errorIcon}>{errorContent.icon}</div>
          <div className={styles.errorCode}>{errorContent.code}</div>
        </div>

        <div className={styles.brokenPlate}>
          <div className={styles.plateLeft}>🍽️</div>
          <div className={styles.plateRight}></div>
          <div className={styles.crackLine}></div>
        </div>

        <h1 className={styles.title}>{errorContent.title}</h1>
        <p className={styles.description}>{errorContent.description}</p>

        <div className={styles.errorDetails}>
          <details className={styles.technicalDetails}>
            <summary>Technical Details</summary>
            <div className={styles.errorInfo}>
              <p>
                <strong>Error Type:</strong> {errorType.toUpperCase()}
              </p>
              <p>
                <strong>Timestamp:</strong> {new Date().toLocaleString()}
              </p>
              <p>
                <strong>Message:</strong>{" "}
                {error?.message || "Unknown error occurred"}
              </p>
              {error?.digest && (
                <p>
                  <strong>Error ID:</strong> {error.digest}
                </p>
              )}
            </div>
          </details>
        </div>

        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>What you can try:</h3>
          <ul className={styles.suggestionsList}>
            <li>🔄 Refresh the page or try again</li>
            <li>🌐 Check your internet connection</li>
            <li>⏳ Wait a few minutes and retry</li>
            <li>
              🏠 Go back to our{" "}
              <Link href="/" className={styles.link}>
                Homepage
              </Link>
            </li>
            <li>
              📞{" "}
              <Link href="/contact" className={styles.link}>
                Contact support
              </Link>{" "}
              if issue persists
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button
            onClick={handleRetry}
            className={`${styles.primaryBtn} ${
              isRetrying ? styles.retrying : ""
            }`}
            disabled={isRetrying}
          >
            <span className={styles.btnIcon}>{isRetrying ? "🔄" : "🔄"}</span>
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
          <Link href="/" className={styles.secondaryBtn}>
            <span className={styles.btnIcon}>🏠</span>
            Go Home
          </Link>
          <Link href="/contact" className={styles.tertiaryBtn}>
            <span className={styles.btnIcon}>📞</span>
            Get Help
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <p>Error ID: {Math.random().toString(36).substring(2, 15)}</p>
        <p>Our kitchen staff has been notified and is working on a fix!</p>
      </div>
    </div>
  );
};

export default GlobalError;
