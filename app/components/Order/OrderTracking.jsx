"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  Phone,
  MessageSquare,
  Star,
  User,
  Navigation,
  Timer,
  Package,
  Utensils,
  Heart,
  Share2,
  Calendar,
  Users,
} from "lucide-react";
import styles from "./OrderTracking.module.css";

const OrderTracking = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [orderData] = useState({
    orderId: "#ORD-2024-001234",
    restaurant: {
      name: "Italian Bistro",
      cuisine: "Italian",
      rating: 4.8,
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Downtown",
      image: "🍝",
    },
    driver: {
      name: "Michael Johnson",
      rating: 4.9,
      phone: "+1 (555) 987-6543",
      vehicle: "Honda Civic - ABC 123",
      photo: "👨‍🚗",
    },
    items: [
      { name: "Margherita Pizza", quantity: 2, price: 24.99 },
      { name: "Caesar Salad", quantity: 1, price: 12.99 },
      { name: "Garlic Bread", quantity: 1, price: 6.99 },
    ],
    total: 44.97,
    deliveryAddress: "456 Oak Avenue, Apt 2B",
    orderTime: "2:30 PM",
    estimatedDelivery: "3:15 PM",
  });

  const [reservationData, setReservationData] = useState({
    selectedRestaurant: "",
    partySize: 2,
    reservationDate: "",
    reservationTime: "",
    specialRequests: "",
  });

  const trackingSteps = [
    {
      id: 1,
      title: "Order Placed",
      description: "Your order has been confirmed",
      icon: CheckCircle,
      time: "2:30 PM",
      completed: true,
    },
    {
      id: 2,
      title: "Preparing",
      description: "Restaurant is preparing your food",
      icon: ChefHat,
      time: "2:35 PM",
      completed: true,
      active: currentStep === 2,
    },
    {
      id: 3,
      title: "Out for Delivery",
      description: "Driver is on the way",
      icon: Truck,
      time: "Est. 3:00 PM",
      completed: currentStep >= 3,
      active: currentStep === 3,
    },
    {
      id: 4,
      title: "Delivered",
      description: "Enjoy your meal!",
      icon: Package,
      time: "Est. 3:15 PM",
      completed: currentStep >= 4,
      active: currentStep === 4,
    },
  ];

  const availableRestaurants = [
    {
      id: 1,
      name: "Italian Bistro",
      cuisine: "Italian",
      rating: 4.8,
      waitTime: "15-25 min",
    },
    {
      id: 2,
      name: "Sushi House",
      cuisine: "Japanese",
      rating: 4.9,
      waitTime: "20-30 min",
    },
    {
      id: 3,
      name: "French Corner",
      cuisine: "French",
      rating: 4.7,
      waitTime: "25-35 min",
    },
    {
      id: 4,
      name: "BBQ Paradise",
      cuisine: "American",
      rating: 4.6,
      waitTime: "20-30 min",
    },
    {
      id: 5,
      name: "Thai Garden",
      cuisine: "Thai",
      rating: 4.8,
      waitTime: "15-25 min",
    },
    {
      id: 6,
      name: "Mexican Fiesta",
      cuisine: "Mexican",
      rating: 4.5,
      waitTime: "20-30 min",
    },
  ];

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedTime((prev) => Math.max(0, prev - 1));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleReservationSubmit = () => {
    console.log("Reservation submitted:", reservationData);
    // Add reservation logic here
  };

  return (
    <div className={styles.trackingContainer}>
      {/* Header */}
      <div className={styles.trackingHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Order Tracking</h1>
          <p className={styles.subtitle}>
            Track your delicious food in real-time
          </p>
          <div className={styles.orderInfo}>
            <div className={styles.orderId}>
              <Package className={styles.packageIcon} />
              <span>Order {orderData.orderId}</span>
            </div>
            <div className={styles.estimatedTime}>
              <Timer className={styles.timerIcon} />
              <span>{estimatedTime} min remaining</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.trackingLayout}>
        {/* Main Tracking Section */}
        <div className={styles.mainContent}>
          {/* Live Map Section */}
          <div className={styles.mapSection}>
            <div className={styles.mapContainer}>
              <div className={styles.mapPlaceholder}>
                <div className={styles.mapIcon}>
                  <Navigation size={48} />
                </div>
                <p>Live tracking map would be integrated here</p>
                <div className={styles.mapMarkers}>
                  <div className={styles.restaurantMarker}>
                    <MapPin size={20} />
                    <span>Restaurant</span>
                  </div>
                  <div className={styles.driverMarker}>
                    <Truck size={20} />
                    <span>Driver</span>
                  </div>
                  <div className={styles.destinationMarker}>
                    <User size={20} />
                    <span>You</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tracking Steps */}
          <div className={styles.trackingSteps}>
            <h3 className={styles.stepsTitle}>Order Progress</h3>
            <div className={styles.stepsContainer}>
              {trackingSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`${styles.step} ${
                      step.completed ? styles.completed : ""
                    } ${step.active ? styles.active : ""}`}
                  >
                    <div className={styles.stepIcon}>
                      <IconComponent size={24} />
                    </div>
                    <div className={styles.stepContent}>
                      <h4 className={styles.stepTitle}>{step.title}</h4>
                      <p className={styles.stepDescription}>
                        {step.description}
                      </p>
                      <span className={styles.stepTime}>{step.time}</span>
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`${styles.stepConnector} ${
                          step.completed ? styles.connectorCompleted : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restaurant & Driver Info */}
          <div className={styles.infoCards}>
            <div className={styles.restaurantCard}>
              <div className={styles.cardHeader}>
                <div className={styles.restaurantIcon}>
                  <Utensils size={24} />
                </div>
                <div className={styles.restaurantInfo}>
                  <h4>{orderData.restaurant.name}</h4>
                  <p>
                    {orderData.restaurant.cuisine} • ⭐{" "}
                    {orderData.restaurant.rating}
                  </p>
                  <p className={styles.address}>
                    {orderData.restaurant.address}
                  </p>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>
                    <Phone size={16} />
                  </button>
                  <button className={styles.actionBtn}>
                    <Heart size={16} />
                  </button>
                </div>
              </div>
            </div>

            {currentStep >= 3 && (
              <div className={styles.driverCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.driverPhoto}>
                    {orderData.driver.photo}
                  </div>
                  <div className={styles.driverInfo}>
                    <h4>{orderData.driver.name}</h4>
                    <p>
                      ⭐ {orderData.driver.rating} • {orderData.driver.vehicle}
                    </p>
                    <p className={styles.driverStatus}>On the way to you</p>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.actionBtn}>
                      <Phone size={16} />
                    </button>
                    <button className={styles.actionBtn}>
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.orderItems}>
              {orderData.items.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>
                      x{item.quantity}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>${item.price}</span>
                </div>
              ))}
            </div>
            <div className={styles.orderTotal}>
              <span>
                Total: <strong>${orderData.total}</strong>
              </span>
            </div>
          </div>

          {/* Quick Reservation */}
          <div className={styles.reservationSection}>
            <h3 className={styles.reservationTitle}>
              <Calendar className={styles.calendarIcon} />
              Make a Reservation
            </h3>

            <div className={styles.reservationForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Select Restaurant</label>
                <select
                  className={styles.select}
                  value={reservationData.selectedRestaurant}
                  onChange={(e) =>
                    setReservationData((prev) => ({
                      ...prev,
                      selectedRestaurant: e.target.value,
                    }))
                  }
                >
                  <option value="">Choose a restaurant</option>
                  {availableRestaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.name}>
                      {restaurant.name} - {restaurant.cuisine} (⭐
                      {restaurant.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Users className={styles.usersIcon} />
                  Party Size
                </label>
                <div className={styles.partySizeSelector}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                    <button
                      key={size}
                      className={`${styles.partySizeBtn} ${
                        reservationData.partySize === size ? styles.active : ""
                      }`}
                      onClick={() =>
                        setReservationData((prev) => ({
                          ...prev,
                          partySize: size,
                        }))
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Date</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={reservationData.reservationDate}
                    onChange={(e) =>
                      setReservationData((prev) => ({
                        ...prev,
                        reservationDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Time</label>
                  <select
                    className={styles.select}
                    value={reservationData.reservationTime}
                    onChange={(e) =>
                      setReservationData((prev) => ({
                        ...prev,
                        reservationTime: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Special Requests</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Any special requirements..."
                  value={reservationData.specialRequests}
                  onChange={(e) =>
                    setReservationData((prev) => ({
                      ...prev,
                      specialRequests: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <button
                className={styles.reserveButton}
                onClick={handleReservationSubmit}
              >
                Make Reservation
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3 className={styles.actionsTitle}>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button className={styles.actionButton}>
                <Heart size={18} />
                <span>Save Restaurant</span>
              </button>
              <button className={styles.actionButton}>
                <Share2 size={18} />
                <span>Share Order</span>
              </button>
              <button className={styles.actionButton}>
                <MessageSquare size={18} />
                <span>Help & Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
