// app/user-dashboard/page.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingBag,
  Clock,
  Heart,
  Star,
  TrendingUp,
  MapPin,
  Calendar,
  CreditCard,
  Package,
  Utensils,
  Gift,
  Bell,
  User,
  Settings,
  ChevronRight,
  Loader,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useHttpClient } from "../shared/hooks/http-hook";
import styles from "./HomePage.module.css";

// SafeImage component and helper functions
const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.3em' font-family='sans-serif' font-size='14' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

// Custom Error class for better error handling
class DashboardError extends Error {
  constructor(message, type = "general") {
    super(message);
    this.name = "DashboardError";
    this.errorType = type;
    this.dashboardError = true;
  }
}

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  const { isLoading: httpLoading, sendRequest } = useHttpClient();

  // Handle image error with tracking to prevent infinite loops
  const handleImageError = useCallback(
    (imageUrl, fallbackUrl) => {
      return (e) => {
        const currentSrc = e.target.src;

        // If we haven't tried the fallback yet, try it
        if (currentSrc !== fallbackUrl && !imageErrors.has(imageUrl)) {
          setImageErrors((prev) => new Set(prev).add(imageUrl));
          e.target.src = fallbackUrl;
        } else {
          // Use data URL as final fallback
          e.target.src = fallbackImage;
        }
      };
    },
    [imageErrors]
  );

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Enhanced error detection
  const determineErrorType = (errorMessage) => {
    const msg = errorMessage.toLowerCase();

    if (
      msg.includes("fetch") ||
      msg.includes("network") ||
      msg.includes("internet connection")
    ) {
      return "network";
    }
    if (
      msg.includes("server") ||
      msg.includes("backend") ||
      msg.includes("500")
    ) {
      return "server";
    }
    if (
      msg.includes("unauthorized") ||
      msg.includes("401") ||
      msg.includes("authentication")
    ) {
      return "auth";
    }
    if (msg.includes("api endpoint") || msg.includes("404")) {
      return "config";
    }
    return "general";
  };

  // Fetch dashboard data from backend with enhanced error throwing
  const fetchDashboardData = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setIsLoading(true);
        }

        // Check online status first
        if (!navigator.onLine) {
          const error = new DashboardError(
            "No internet connection. Please check your connection and try again.",
            "network"
          );
          throw error;
        }

        // Check authentication
        const token = localStorage.getItem("token");
        if (!token) {
          const error = new DashboardError(
            "Authentication required. Please log in again.",
            "auth"
          );
          throw error;
        }

        // Make the API request
        const response = await sendRequest(
          "http://localhost:5001/api/users/dashboard",
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (response && response.success) {
          setDashboardData(response.data);
          // Reset image errors on successful data fetch
          setImageErrors(new Set());
        } else {
          const errorMsg =
            response?.message || "Failed to fetch dashboard data";
          const error = new DashboardError(
            errorMsg,
            determineErrorType(errorMsg)
          );
          throw error;
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        // If it's already a DashboardError, just throw it
        if (err.dashboardError) {
          throw err;
        }

        // Handle different types of errors and convert them to DashboardError
        let errorMessage = "Something went wrong while loading your dashboard.";
        let errorType = "general";

        if (err.name === "TypeError" && err.message.includes("fetch")) {
          errorMessage =
            "Network error: Unable to connect to server. Please check if the backend server is running and accessible.";
          errorType = "network";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage =
            "Network error: Backend server is unreachable. Please check your connection.";
          errorType = "network";
        } else if (err.message.includes("AbortError")) {
          errorMessage = "Request was aborted or timed out";
          errorType = "network";
        } else if (
          err.message.includes("Server error") ||
          err.message.includes("500")
        ) {
          errorMessage = "Server error: Backend server is experiencing issues";
          errorType = "server";
        } else if (
          err.message.includes("Unauthorized") ||
          err.message.includes("401")
        ) {
          errorMessage = "Unauthorized access";
          errorType = "auth";
        } else if (
          err.message.includes("API endpoint not found") ||
          err.message.includes("404")
        ) {
          errorMessage = "API endpoint not found";
          errorType = "config";
        } else if (err.message) {
          errorMessage = err.message;
          errorType = determineErrorType(err.message);
        }

        // Create and throw a DashboardError that the error boundary can catch
        const dashboardError = new DashboardError(errorMessage, errorType);
        throw dashboardError;
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [sendRequest]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-retry when coming back online
  useEffect(() => {
    if (isOnline && !dashboardData) {
      fetchDashboardData();
    }
  }, [isOnline, dashboardData, fetchDashboardData]);

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      delivered: "#10B981",
      completed: "#10B981",
      preparing: "#F59E0B",
      ready: "#3B82F6",
      shipped: "#3B82F6",
      cancelled: "#EF4444",
      pending: "#6B7280",
    };
    return colors[status] || "#6B7280";
  };

  const getStatusText = (status) => {
    const statusMap = {
      delivered: "Delivered",
      completed: "Completed",
      preparing: "Preparing",
      ready: "Ready",
      shipped: "On the way",
      cancelled: "Cancelled",
      pending: "Pending",
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Custom Image component to handle errors better
  const SafeImage = ({
    src,
    alt,
    className,
    fallback = fallbackImage,
    ...props
  }) => {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError(src, fallback)}
        {...props}
      />
    );
  };

  // Loading state - simplified since error handling is now centralized
  if (isLoading && !dashboardData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <Loader className={styles.loadingSpinner} />
          <p>Loading your dashboard...</p>
          {!isOnline && (
            <div className={styles.offlineIndicator}>
              <WifiOff size={20} />
              <span>You're currently offline</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If no data is available after loading, this indicates an error
  // The error should have been thrown and caught by the error boundary
  if (!dashboardData) {
    // This is a fallback - the error boundary should have caught it
    throw new DashboardError("No dashboard data available", "general");
  }

  const { user, stats, recentOrders, favoriteItems, notifications } =
    dashboardData;

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Connection status indicator */}
        {!isOnline && (
          <div className={styles.connectionBanner}>
            <WifiOff size={20} />
            <span>You're offline. Some features may not work properly.</span>
          </div>
        )}

        {/* Welcome Header */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <SafeImage
                  src={user?.profileImage}
                  alt={user?.name || "User"}
                />
                <div className={styles.statusIndicator}></div>
              </div>
              <div className={styles.userDetails}>
                <h1 className={styles.welcomeTitle}>
                  Welcome back, {user?.name || "Guest"}!
                </h1>
                <p className={styles.welcomeSubtitle}>
                  Member since {user?.joinDate} • {stats?.totalOrders || 0}{" "}
                  orders completed
                </p>
              </div>
            </div>

            <div className={styles.quickActions}>
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing || httpLoading}
                className={styles.actionButton}
              >
                <RefreshCw className={refreshing ? styles.spinning : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button className={styles.actionButton}>
                <Utensils />
                Order Now
              </button>
              <button className={styles.actionButton}>
                <Clock />
                Reorder
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {[
            {
              icon: ShoppingBag,
              label: "Total Orders",
              value: stats?.totalOrders || 0,
              iconClass: styles.iconBlue,
              growth: stats?.growth?.orders || 0,
            },
            {
              icon: CreditCard,
              label: "Total Spent",
              value: `${stats?.totalSpent || 0}`,
              iconClass: styles.iconGreen,
              growth: stats?.growth?.spent || 0,
            },
            {
              icon: Heart,
              label: "Favorite Items",
              value: stats?.favoriteItems || 0,
              iconClass: styles.iconPink,
              growth: stats?.growth?.favorites || 0,
            },
            {
              icon: Gift,
              label: "Reward Points",
              value: stats?.rewardPoints || 0,
              iconClass: styles.iconPurple,
              growth: stats?.growth?.points || 0,
            },
          ].map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={`${styles.statIcon} ${stat.iconClass}`}>
                <stat.icon />
              </div>
              <div className={styles.statNumber}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statTrend}>
                <TrendingUp />+{stat.growth}% this month
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Recent Orders */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Package />
                Recent Orders
              </h2>
              <button className={styles.viewAllButton}>
                View All
                <ChevronRight />
              </button>
            </div>

            <div className={styles.ordersList}>
              {recentOrders?.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className={styles.orderItem}>
                    <div className={styles.orderImageContainer}>
                      <SafeImage
                        src={order.image}
                        alt="Order"
                        className={styles.orderImage}
                      />
                    </div>

                    <div className={styles.orderDetails}>
                      <div className={styles.orderHeader}>
                        <span className={styles.orderId}>
                          #{order.orderNumber || order.id}
                        </span>
                        <div
                          className={styles.orderStatus}
                          style={{
                            backgroundColor: getStatusColor(order.status),
                          }}
                        >
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                      </div>

                      <p className={styles.orderItems}>
                        {Array.isArray(order.items)
                          ? order.items.join(", ")
                          : "Order items"}
                      </p>

                      <div className={styles.orderMeta}>
                        <span className={styles.orderDate}>
                          <Calendar />
                          {formatDate(order.date)}
                        </span>
                        <span className={styles.orderTotal}>
                          ${order.total}
                        </span>
                      </div>
                    </div>

                    <button className={styles.reorderButton}>
                      <Clock />
                      Reorder
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Package className={styles.emptyIcon} />
                  <p>No orders yet</p>
                  <p className={styles.emptySubtext}>
                    Your order history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Items */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Heart />
                Your Favorites
              </h2>
              <button className={styles.viewAllButton}>
                View All
                <ChevronRight />
              </button>
            </div>

            <div className={styles.favoritesList}>
              {favoriteItems?.length > 0 ? (
                favoriteItems.map((item) => (
                  <div key={item.id} className={styles.favoriteItem}>
                    <div className={styles.favoriteImageContainer}>
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className={styles.favoriteImage}
                      />
                      <div className={styles.favoriteRating}>
                        <Star />
                        {item.rating}
                      </div>
                    </div>

                    <div className={styles.favoriteDetails}>
                      <h4 className={styles.favoriteName}>{item.name}</h4>
                      <p className={styles.favoritePrice}>${item.price}</p>
                      <p className={styles.favoriteCount}>
                        Ordered {item.orderCount} times
                      </p>
                    </div>

                    <button className={styles.addToCartButton}>
                      <ShoppingBag />
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Heart className={styles.emptyIcon} />
                  <p>No favorites yet</p>
                  <p className={styles.emptySubtext}>Heart items you love!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          {/* Notifications */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Bell />
                Notifications
              </h2>
              <button className={styles.markAllButton}>Mark all read</button>
            </div>

            <div className={styles.notificationsList}>
              {notifications?.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      notification.unread ? styles.unread : ""
                    }`}
                  >
                    <div className={styles.notificationIcon}>
                      {notification.type === "order" && <Package />}
                      {notification.type === "promotion" && <Gift />}
                      {notification.type === "reward" && <Star />}
                    </div>

                    <div className={styles.notificationContent}>
                      <p className={styles.notificationMessage}>
                        {notification.message}
                      </p>
                      <span className={styles.notificationTime}>
                        {notification.time}
                      </span>
                    </div>

                    {notification.unread && (
                      <div className={styles.unreadDot}></div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Bell className={styles.emptyIcon} />
                  <p>No notifications</p>
                  <p className={styles.emptySubtext}>You're all caught up!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>

            <div className={styles.quickLinksGrid}>
              {[
                { icon: User, label: "Profile Settings" },
                { icon: MapPin, label: "Manage Addresses" },
                { icon: CreditCard, label: "Payment Methods" },
                { icon: Gift, label: "Rewards Program" },
                { icon: Calendar, label: "Schedule Orders" },
                { icon: Settings, label: "Preferences" },
              ].map((action, index) => (
                <button key={index} className={styles.quickLinkItem}>
                  <action.icon />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
