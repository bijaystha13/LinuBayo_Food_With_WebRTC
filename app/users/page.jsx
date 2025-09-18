"use client";

import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";
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
} from "lucide-react";

const UserDashboard = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    joinDate: "March 2024",
    profileImage: "/api/placeholder/100/100",
  });

  const [stats, setStats] = useState({
    totalOrders: 24,
    totalSpent: 486.5,
    favoriteItems: 12,
    rewardPoints: 2850,
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-09-15",
      status: "delivered",
      items: ["Margherita Pizza", "Garlic Bread"],
      total: 28.5,
      image: "/api/placeholder/60/60",
    },
    {
      id: "ORD-2024-002",
      date: "2024-09-12",
      status: "preparing",
      items: ["Chicken Burger", "Fries", "Coca Cola"],
      total: 22.99,
      image: "/api/placeholder/60/60",
    },
    {
      id: "ORD-2024-003",
      date: "2024-09-10",
      status: "delivered",
      items: ["Caesar Salad", "Grilled Salmon"],
      total: 34.75,
      image: "/api/placeholder/60/60",
    },
  ]);

  const [favoriteItems, setFavoriteItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      price: 18.99,
      rating: 4.8,
      image: "/api/placeholder/80/80",
      orderCount: 6,
    },
    {
      id: 2,
      name: "Chicken Burger",
      price: 15.5,
      rating: 4.6,
      image: "/api/placeholder/80/80",
      orderCount: 4,
    },
    {
      id: 3,
      name: "Caesar Salad",
      price: 12.99,
      rating: 4.7,
      image: "/api/placeholder/80/80",
      orderCount: 3,
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      message: "Your order #ORD-2024-002 is being prepared",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "promotion",
      message: "New 20% discount on Italian cuisine!",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 3,
      type: "reward",
      message: "You earned 150 reward points!",
      time: "1 day ago",
      unread: false,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "#10B981";
      case "preparing":
        return "#F59E0B";
      case "shipped":
        return "#3B82F6";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "preparing":
        return "Preparing";
      case "shipped":
        return "On the way";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Welcome Header */}
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img src={user.profileImage} alt={user.name} />
                <div className={styles.statusIndicator}></div>
              </div>
              <div className={styles.userDetails}>
                <h1 className={styles.welcomeTitle}>
                  Welcome back, {user.name}!
                </h1>
                <p className={styles.welcomeSubtitle}>
                  Member since {user.joinDate} • {stats.totalOrders} orders
                  completed
                </p>
              </div>
            </div>
            <div className={styles.quickActions}>
              <button className={styles.actionButton}>
                <Utensils size={20} />
                <span>Order Now</span>
              </button>
              <button className={styles.actionButton}>
                <Clock size={20} />
                <span>Reorder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <ShoppingBag className={styles.iconBlue} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>{stats.totalOrders}</h3>
              <p className={styles.statLabel}>Total Orders</p>
              <span className={styles.statTrend}>
                <TrendingUp size={14} />
                +12% this month
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CreditCard className={styles.iconGreen} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>${stats.totalSpent}</h3>
              <p className={styles.statLabel}>Total Spent</p>
              <span className={styles.statTrend}>
                <TrendingUp size={14} />
                +8% this month
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Heart className={styles.iconPink} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>{stats.favoriteItems}</h3>
              <p className={styles.statLabel}>Favorite Items</p>
              <span className={styles.statTrend}>
                <TrendingUp size={14} />
                +3 new favorites
              </span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Gift className={styles.iconPurple} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statNumber}>{stats.rewardPoints}</h3>
              <p className={styles.statLabel}>Reward Points</p>
              <span className={styles.statTrend}>
                <TrendingUp size={14} />
                +250 this week
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainContent}>
          {/* Recent Orders */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Package size={24} />
                Recent Orders
              </h2>
              <button className={styles.viewAllButton}>
                View All
                <ChevronRight size={16} />
              </button>
            </div>
            <div className={styles.ordersList}>
              {recentOrders.map((order) => (
                <div key={order.id} className={styles.orderItem}>
                  <div className={styles.orderImageContainer}>
                    <img
                      src={order.image}
                      alt="Order"
                      className={styles.orderImage}
                    />
                  </div>
                  <div className={styles.orderDetails}>
                    <div className={styles.orderHeader}>
                      <span className={styles.orderId}>#{order.id}</span>
                      <span
                        className={styles.orderStatus}
                        style={{
                          backgroundColor: getStatusColor(order.status),
                        }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className={styles.orderItems}>
                      {order.items.join(", ")}
                    </p>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderDate}>
                        <Calendar size={14} />
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span className={styles.orderTotal}>${order.total}</span>
                    </div>
                  </div>
                  <button className={styles.reorderButton}>
                    <Clock size={16} />
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Items */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Heart size={24} />
                Your Favorites
              </h2>
              <button className={styles.viewAllButton}>
                View All
                <ChevronRight size={16} />
              </button>
            </div>
            <div className={styles.favoritesList}>
              {favoriteItems.map((item) => (
                <div key={item.id} className={styles.favoriteItem}>
                  <div className={styles.favoriteImageContainer}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.favoriteImage}
                    />
                    <div className={styles.favoriteRating}>
                      <Star size={12} fill="currentColor" />
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
                    <ShoppingBag size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications & Quick Links */}
        <div className={styles.bottomSection}>
          {/* Notifications */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Bell size={24} />
                Notifications
              </h2>
              <button className={styles.markAllButton}>Mark all read</button>
            </div>
            <div className={styles.notificationsList}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    notification.unread ? styles.unread : ""
                  }`}
                >
                  <div className={styles.notificationIcon}>
                    {notification.type === "order" && <Package size={16} />}
                    {notification.type === "promotion" && <Gift size={16} />}
                    {notification.type === "reward" && <Star size={16} />}
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
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.contentCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
            </div>
            <div className={styles.quickLinksGrid}>
              <button className={styles.quickLinkItem}>
                <User size={20} />
                <span>Profile Settings</span>
              </button>
              <button className={styles.quickLinkItem}>
                <MapPin size={20} />
                <span>Manage Addresses</span>
              </button>
              <button className={styles.quickLinkItem}>
                <CreditCard size={20} />
                <span>Payment Methods</span>
              </button>
              <button className={styles.quickLinkItem}>
                <Gift size={20} />
                <span>Rewards Program</span>
              </button>
              <button className={styles.quickLinkItem}>
                <Calendar size={20} />
                <span>Schedule Orders</span>
              </button>
              <button className={styles.quickLinkItem}>
                <Settings size={20} />
                <span>Preferences</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
