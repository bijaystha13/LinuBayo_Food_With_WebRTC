"use client";

import React, { useState, useEffect } from "react";
import styles from "./UserOrders.module.css";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Star,
  Eye,
  RotateCcw,
  Download,
  Filter,
  Search,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";

const UserOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-2024-001",
      date: "2024-09-15T14:30:00Z",
      status: "delivered",
      items: [
        {
          name: "Margherita Pizza",
          quantity: 1,
          price: 18.99,
          image: "/api/placeholder/80/80",
        },
        {
          name: "Garlic Bread",
          quantity: 2,
          price: 4.99,
          image: "/api/placeholder/80/80",
        },
      ],
      total: 28.97,
      deliveryAddress: "123 Main St, Toronto, ON M5V 3A8",
      estimatedDelivery: "2024-09-15T15:00:00Z",
      actualDelivery: "2024-09-15T14:55:00Z",
      paymentMethod: "Credit Card (*4532)",
      driver: { name: "Mike Johnson", phone: "+1 (416) 555-0123" },
      rating: 5,
      canReorder: true,
      canCancel: false,
    },
    {
      id: "ORD-2024-002",
      date: "2024-09-14T12:15:00Z",
      status: "preparing",
      items: [
        {
          name: "Chicken Burger",
          quantity: 1,
          price: 15.5,
          image: "/api/placeholder/80/80",
        },
        {
          name: "French Fries",
          quantity: 1,
          price: 5.99,
          image: "/api/placeholder/80/80",
        },
        {
          name: "Coca Cola",
          quantity: 1,
          price: 2.5,
          image: "/api/placeholder/80/80",
        },
      ],
      total: 23.99,
      deliveryAddress: "456 Oak Ave, Toronto, ON M4W 1A1",
      estimatedDelivery: "2024-09-14T13:30:00Z",
      paymentMethod: "Debit Card (*8765)",
      canReorder: true,
      canCancel: true,
    },
    {
      id: "ORD-2024-003",
      date: "2024-09-12T19:45:00Z",
      status: "cancelled",
      items: [
        {
          name: "Caesar Salad",
          quantity: 1,
          price: 12.99,
          image: "/api/placeholder/80/80",
        },
        {
          name: "Grilled Salmon",
          quantity: 1,
          price: 24.99,
          image: "/api/placeholder/80/80",
        },
      ],
      total: 37.98,
      deliveryAddress: "789 Pine St, Toronto, ON M6G 2B2",
      paymentMethod: "Credit Card (*1234)",
      cancellationReason: "Restaurant was closed",
      canReorder: true,
      canCancel: false,
    },
    {
      id: "ORD-2024-004",
      date: "2024-09-10T16:20:00Z",
      status: "delivered",
      items: [
        {
          name: "Spaghetti Carbonara",
          quantity: 1,
          price: 16.99,
          image: "/api/placeholder/80/80",
        },
        {
          name: "Tiramisu",
          quantity: 1,
          price: 6.99,
          image: "/api/placeholder/80/80",
        },
      ],
      total: 23.98,
      deliveryAddress: "321 Elm St, Toronto, ON M5T 2L9",
      estimatedDelivery: "2024-09-10T17:00:00Z",
      actualDelivery: "2024-09-10T16:58:00Z",
      paymentMethod: "Digital Wallet",
      driver: { name: "Sarah Chen", phone: "+1 (416) 555-0987" },
      rating: 4,
      canReorder: true,
      canCancel: false,
    },
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const statusConfig = {
    preparing: { color: "#F59E0B", icon: Clock, text: "Preparing" },
    confirmed: { color: "#3B82F6", icon: CheckCircle, text: "Confirmed" },
    shipped: { color: "#8B5CF6", icon: Truck, text: "On the way" },
    delivered: { color: "#10B981", icon: CheckCircle, text: "Delivered" },
    cancelled: { color: "#EF4444", icon: XCircle, text: "Cancelled" },
  };

  const filterOptions = [
    { value: "all", label: "All Orders", count: orders.length },
    {
      value: "preparing",
      label: "Preparing",
      count: orders.filter((o) => o.status === "preparing").length,
    },
    {
      value: "shipped",
      label: "On the way",
      count: orders.filter((o) => o.status === "shipped").length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.status === "delivered").length,
    },
    {
      value: "cancelled",
      label: "Cancelled",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  useEffect(() => {
    let filtered = orders;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((order) => order.status === selectedFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [selectedFilter, searchQuery, orders]);

  const handleReorder = (orderId) => {
    console.log("Reordering:", orderId);
    // Implement reorder logic
  };

  const handleCancelOrder = (orderId) => {
    console.log("Cancelling:", orderId);
    // Implement cancel logic
  };

  const handleViewDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleTrackOrder = (orderId) => {
    console.log("Tracking:", orderId);
    // Implement order tracking
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStarRating = (rating) => {
    return (
      <div className={styles.starRating}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? "#FFD700" : "none"}
            stroke={i < rating ? "#FFD700" : "#666"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>My Orders</h1>
            <p className={styles.pageSubtitle}>
              Track and manage your food orders
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filters
              <ChevronDown className={showFilters ? styles.rotated : ""} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          className={`${styles.filtersSection} ${
            showFilters ? styles.expanded : ""
          }`}
        >
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search orders by ID or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.filterButtons}>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.filterButton} ${
                  selectedFilter === option.value ? styles.active : ""
                }`}
                onClick={() => setSelectedFilter(option.value)}
              >
                {option.label}
                <span className={styles.filterCount}>{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className={styles.ordersContainer}>
          {filteredOrders.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={64} className={styles.emptyIcon} />
              <h3>No orders found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderBasicInfo}>
                    <div className={styles.orderIdDate}>
                      <h3 className={styles.orderId}>#{order.id}</h3>
                      <span className={styles.orderDate}>
                        <Calendar size={16} />
                        {formatDate(order.date)}
                      </span>
                    </div>
                    <div
                      className={styles.orderStatus}
                      style={{
                        backgroundColor: statusConfig[order.status]?.color,
                      }}
                    >
                      {React.createElement(statusConfig[order.status]?.icon, {
                        size: 16,
                      })}
                      {statusConfig[order.status]?.text}
                    </div>
                  </div>

                  <div className={styles.orderActions}>
                    <span className={styles.orderTotal}>
                      ${order.total.toFixed(2)}
                    </span>
                    <button
                      className={styles.expandButton}
                      onClick={() => handleViewDetails(order.id)}
                    >
                      <ChevronRight
                        className={
                          expandedOrder === order.id ? styles.rotated : ""
                        }
                      />
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className={styles.orderItemsPreview}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className={styles.itemPreview}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQuantity}>
                          ×{item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className={styles.moreItems}>
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActions}>
                  {order.canReorder && (
                    <button
                      className={styles.actionButton}
                      onClick={() => handleReorder(order.id)}
                    >
                      <RotateCcw size={16} />
                      Reorder
                    </button>
                  )}

                  {order.status === "preparing" ||
                  order.status === "confirmed" ? (
                    <button
                      className={styles.actionButton}
                      onClick={() => handleTrackOrder(order.id)}
                    >
                      <MapPin size={16} />
                      Track Order
                    </button>
                  ) : null}

                  {order.canCancel && (
                    <button
                      className={`${styles.actionButton} ${styles.cancelButton}`}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}

                  <button
                    className={styles.actionButton}
                    onClick={() => handleViewDetails(order.id)}
                  >
                    <Eye size={16} />
                    Details
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className={styles.expandedDetails}>
                    <div className={styles.detailsGrid}>
                      {/* Delivery Information */}
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <MapPin size={18} />
                          Delivery Details
                        </h4>
                        <div className={styles.detailContent}>
                          <p className={styles.deliveryAddress}>
                            {order.deliveryAddress}
                          </p>
                          {order.estimatedDelivery && (
                            <p className={styles.deliveryTime}>
                              <strong>Estimated:</strong>{" "}
                              {formatDate(order.estimatedDelivery)}
                            </p>
                          )}
                          {order.actualDelivery && (
                            <p className={styles.deliveryTime}>
                              <strong>Delivered:</strong>{" "}
                              {formatDate(order.actualDelivery)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>
                          <CreditCard size={18} />
                          Payment
                        </h4>
                        <div className={styles.detailContent}>
                          <p>{order.paymentMethod}</p>
                          <p className={styles.orderTotalDetail}>
                            <strong>Total: ${order.total.toFixed(2)}</strong>
                          </p>
                        </div>
                      </div>

                      {/* Driver Information */}
                      {order.driver && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>
                            <Truck size={18} />
                            Driver
                          </h4>
                          <div className={styles.detailContent}>
                            <p className={styles.driverName}>
                              {order.driver.name}
                            </p>
                            <div className={styles.driverActions}>
                              <button className={styles.contactButton}>
                                <Phone size={14} />
                                Call
                              </button>
                              <button className={styles.contactButton}>
                                <MessageCircle size={14} />
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rating Section */}
                      {order.rating && (
                        <div className={styles.detailSection}>
                          <h4 className={styles.detailTitle}>
                            <Star size={18} />
                            Your Rating
                          </h4>
                          <div className={styles.detailContent}>
                            {renderStarRating(order.rating)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Full Items List */}
                    <div className={styles.fullItemsList}>
                      <h4 className={styles.detailTitle}>Order Items</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className={styles.fullItem}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.fullItemImage}
                          />
                          <div className={styles.fullItemDetails}>
                            <span className={styles.fullItemName}>
                              {item.name}
                            </span>
                            <span className={styles.fullItemQuantity}>
                              Quantity: {item.quantity}
                            </span>
                          </div>
                          <span className={styles.fullItemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Cancellation Reason */}
                    {order.cancellationReason && (
                      <div className={styles.cancellationInfo}>
                        <h4 className={styles.detailTitle}>
                          <XCircle size={18} />
                          Cancellation Reason
                        </h4>
                        <p className={styles.cancellationReason}>
                          {order.cancellationReason}
                        </p>
                      </div>
                    )}

                    {/* Additional Actions */}
                    <div className={styles.additionalActions}>
                      <button className={styles.secondaryButton}>
                        <Download size={16} />
                        Download Receipt
                      </button>
                      {order.status === "delivered" && !order.rating && (
                        <button className={styles.secondaryButton}>
                          <Star size={16} />
                          Rate Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
