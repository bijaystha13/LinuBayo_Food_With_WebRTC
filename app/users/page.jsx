// Save this as: app/user-dashboard/page.js
"use client";
import { useAuth } from "../shared/hooks/auth-hook";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  WifiOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useHttpClient } from "../shared/hooks/http-hook";
import styles from "./HomePage.module.css";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.3em' font-family='sans-serif' font-size='14' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [removingFavoriteId, setRemovingFavoriteId] = useState(null);
  const { token, isLoggedIn } = useAuth();
  const router = useRouter();
  const { sendRequest } = useHttpClient();

  const handleImageError = useCallback(
    (imageUrl) => (e) => {
      if (!imageErrors.has(imageUrl)) {
        setImageErrors((prev) => new Set(prev).add(imageUrl));
        e.target.src = fallbackImage;
      }
    },
    [imageErrors]
  );

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

  const fetchDashboardData = useCallback(
    async (showRefresh = false) => {
      try {
        showRefresh ? setRefreshing(true) : setIsLoading(true);

        if (!isLoggedIn || !token) {
          router.push("/auth?mode=login");
          return;
        }

        const response = await sendRequest(
          "http://localhost:5001/api/users/dashboard",
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (response?.success) {
          setDashboardData(response.data);
          setImageErrors(new Set());
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [sendRequest, router, isLoggedIn, token]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle removing favorite
  const handleRemoveFavorite = async (itemId) => {
    try {
      setRemovingFavoriteId(itemId);

      const response = await sendRequest(
        `http://localhost:5001/api/users/favorites/${itemId}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response?.success) {
        // Update the dashboard data to remove the item
        setDashboardData((prevData) => ({
          ...prevData,
          favoriteItems: prevData.favoriteItems.filter(
            (item) => item.id !== itemId
          ),
          stats: {
            ...prevData.stats,
            favoriteItems: (prevData.stats.favoriteItems || 1) - 1,
          },
        }));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    } finally {
      setRemovingFavoriteId(null);
    }
  };

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

  const SafeImage = ({ src, alt, className, ...props }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError(src)}
      {...props}
    />
  );

  if (isLoading && !dashboardData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <Loader className={styles.spinner} />
          <p>Loading your dashboard...</p>
          {!isOnline && (
            <div className={styles.offlineMsg}>
              <WifiOff size={20} />
              <span>You're currently offline</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { user, stats, recentOrders, favoriteItems, notifications } =
    dashboardData;

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {!isOnline && (
          <div className={styles.offlineBanner}>
            <WifiOff size={20} />
            <span>You're offline. Some features may not work.</span>
          </div>
        )}

        {/* Welcome Section */}
        <div className={styles.welcome}>
          <div className={styles.welcomeContent}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <SafeImage
                  src={user?.profileImage}
                  alt={user?.name || "User"}
                />
                <div className={styles.statusDot}></div>
              </div>
              <div>
                <h1 className={styles.welcomeTitle}>
                  Welcome back, {user?.name || "Guest"}!
                </h1>
                <p className={styles.welcomeText}>
                  Member since {user?.joinDate} • {stats?.totalOrders || 0}{" "}
                  orders
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className={styles.btn}
              >
                <RefreshCw className={refreshing ? styles.spin : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={() => router.push("/menu")}
                className={styles.btn}
              >
                <Utensils />
                Order Now
              </button>
              <button
                onClick={() =>
                  recentOrders?.[0] &&
                  router.push(`/orders/${recentOrders[0].id}`)
                }
                className={styles.btn}
              >
                <Clock />
                Reorder
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.stats}>
          {[
            {
              icon: ShoppingBag,
              label: "Total Orders",
              value: stats?.totalOrders || 0,
              color: "#3B82F6",
              growth: stats?.growth?.orders || 0,
            },
            {
              icon: CreditCard,
              label: "Total Spent",
              value: `$${stats?.totalSpent || 0}`,
              color: "#10B981",
              growth: stats?.growth?.spent || 0,
            },
            {
              icon: Heart,
              label: "Favorite Items",
              value: stats?.favoriteItems || 0,
              color: "#EC4899",
              growth: stats?.growth?.favorites || 0,
            },
            {
              icon: Gift,
              label: "Reward Points",
              value: stats?.rewardPoints || 0,
              color: "#8B5CF6",
              growth: stats?.growth?.points || 0,
            },
          ].map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: stat.color }}>
                <stat.icon />
              </div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statGrowth}>
                <TrendingUp size={14} />+{stat.growth}%
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className={styles.grid}>
          {/* Recent Orders */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Package />
                Recent Orders
              </h2>
              <button
                onClick={() => router.push("/orders")}
                className={styles.viewAll}
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className={styles.list}>
              {recentOrders?.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className={styles.orderItem}>
                    <SafeImage
                      src={order.image}
                      alt="Order"
                      className={styles.orderImg}
                    />

                    <div className={styles.orderInfo}>
                      <div className={styles.orderTop}>
                        <span className={styles.orderId}>
                          #{order.orderNumber || order.id}
                        </span>
                        <div
                          className={styles.status}
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

                      <div className={styles.orderBottom}>
                        <span className={styles.date}>
                          <Calendar size={14} />
                          {formatDate(order.date)}
                        </span>
                        <span className={styles.total}>${order.total}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className={styles.btnSmall}
                    >
                      <Clock size={16} />
                      Reorder
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  <Package size={48} />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Items */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Heart />
                Your Favorites
              </h2>
              <button
                onClick={() => router.push("/favorites")}
                className={styles.viewAll}
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className={styles.list}>
              {favoriteItems?.length > 0 ? (
                favoriteItems.map((item) => (
                  <div key={item.id} className={styles.favItem}>
                    <div className={styles.favImgWrap}>
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className={styles.favImg}
                      />
                      <div className={styles.rating}>
                        <Star size={12} />
                        {item.rating}
                      </div>
                    </div>

                    <div className={styles.favInfo}>
                      <h4>{item.name}</h4>
                      <p className={styles.price}>${item.price}</p>
                      <p className={styles.count}>
                        Ordered {item.orderCount} times
                      </p>
                    </div>

                    <div className={styles.favActions}>
                      <button
                        onClick={() => handleRemoveFavorite(item.id)}
                        disabled={removingFavoriteId === item.id}
                        className={styles.heartBtn}
                        title="Remove from favorites"
                      >
                        <Heart
                          size={20}
                          fill="#ff6b35"
                          className={
                            removingFavoriteId === item.id
                              ? styles.removing
                              : ""
                          }
                        />
                      </button>
                      <button
                        onClick={() => router.push(`/menu/${item.id}`)}
                        className={styles.iconBtn}
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  <Heart size={48} />
                  <p>No favorites yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          {/* Notifications */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Bell />
                Notifications
              </h2>
              <button className={styles.textBtn}>Mark all read</button>
            </div>

            <div className={styles.list}>
              {notifications?.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`${styles.notif} ${
                      notif.unread ? styles.unread : ""
                    }`}
                  >
                    <div className={styles.notifIcon}>
                      {notif.type === "order" && <Package size={20} />}
                      {notif.type === "promotion" && <Gift size={20} />}
                      {notif.type === "reward" && <Star size={20} />}
                    </div>
                    <div className={styles.notifContent}>
                      <p>{notif.message}</p>
                      <span className={styles.time}>{notif.time}</span>
                    </div>
                    {notif.unread && <div className={styles.dot}></div>}
                  </div>
                ))
              ) : (
                <div className={styles.empty}>
                  <Bell size={48} />
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>

            <div className={styles.quickGrid}>
              {[
                { icon: User, label: "Profile", path: "/profile" },
                { icon: MapPin, label: "Addresses", path: "/addresses" },
                { icon: CreditCard, label: "Payments", path: "/payments" },
                { icon: Gift, label: "Rewards", path: "/rewards" },
                { icon: Calendar, label: "Schedule", path: "/schedule" },
                { icon: Settings, label: "Settings", path: "/settings" },
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.path)}
                  className={styles.quickBtn}
                >
                  <action.icon size={20} />
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
