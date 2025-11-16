"use client";
import { useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Heart,
  ShoppingBag,
  Clock,
  Settings,
  ChevronRight,
  Camera,
  Star,
} from "lucide-react";
import styles from "./UserProfile.module.css";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: "47", color: "#FF6B6B" },
    { icon: Heart, label: "Favorites", value: "23", color: "#4ECDC4" },
    { icon: Star, label: "Points", value: "1,250", color: "#FFD93D" },
  ];

  const recentOrders = [
    {
      id: 1,
      name: "Chicken Biryani Bowl",
      date: "Oct 5, 2025",
      price: "$12.99",
      status: "Delivered",
      image: "🍛",
    },
    {
      id: 2,
      name: "Margherita Pizza",
      date: "Oct 3, 2025",
      price: "$15.49",
      status: "Delivered",
      image: "🍕",
    },
    {
      id: 3,
      name: "Caesar Salad",
      date: "Sep 30, 2025",
      price: "$8.99",
      status: "Delivered",
      image: "🥗",
    },
  ];

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "123 Main St, Toronto, ON M5V 3A8",
      default: true,
    },
    {
      id: 2,
      type: "Work",
      address: "456 Bay St, Toronto, ON M5G 2C8",
      default: false,
    },
  ];

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.profileHeader}>
        <div className={styles.headerBg}></div>
        <div className={styles.profileInfo}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              <User size={48} />
            </div>
            <button className={styles.cameraBtn}>
              <Camera size={16} />
            </button>
          </div>
          <div className={styles.userDetails}>
            <h1>John Anderson</h1>
            <p className={styles.memberSince}>Member since March 2024</p>
            <div className={styles.contactInfo}>
              <span>
                <Mail size={14} /> john.anderson@email.com
              </span>
              <span>
                <Phone size={14} /> +1 (416) 555-0123
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={styles.statCard}
            style={{ "--stat-color": stat.color }}
          >
            <div className={styles.statIcon}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "orders" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Recent Orders
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "addresses" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("addresses")}
        >
          Addresses
        </button>
        <button
          className={`${styles.tabBtn} ${
            activeTab === "settings" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {activeTab === "orders" && (
          <div className={styles.ordersList}>
            {recentOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderEmoji}>{order.image}</div>
                <div className={styles.orderDetails}>
                  <h3>{order.name}</h3>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderDate}>
                      <Clock size={14} /> {order.date}
                    </span>
                    <span className={styles.orderStatus}>{order.status}</span>
                  </div>
                </div>
                <div className={styles.orderPrice}>
                  <span>{order.price}</span>
                  <button className={styles.reorderBtn}>
                    Reorder <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "addresses" && (
          <div className={styles.addressesList}>
            {addresses.map((addr) => (
              <div key={addr.id} className={styles.addressCard}>
                <div className={styles.addressHeader}>
                  <div className={styles.addressType}>
                    <MapPin size={20} />
                    <h3>{addr.type}</h3>
                  </div>
                  {addr.default && (
                    <span className={styles.defaultBadge}>Default</span>
                  )}
                </div>
                <p className={styles.addressText}>{addr.address}</p>
                <div className={styles.addressActions}>
                  <button className={`${styles.actionBtn} ${styles.edit}`}>
                    Edit
                  </button>
                  <button className={`${styles.actionBtn} ${styles.delete}`}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button className={styles.addAddressBtn}>+ Add New Address</button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <Settings size={20} />
                <div>
                  <h3>Account Settings</h3>
                  <p>Update your email, password and preferences</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <User size={20} />
                <div>
                  <h3>Personal Information</h3>
                  <p>Edit your name, phone and profile picture</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <Heart size={20} />
                <div>
                  <h3>Dietary Preferences</h3>
                  <p>Set your food preferences and allergies</p>
                </div>
              </div>
              <ChevronRight size={20} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
