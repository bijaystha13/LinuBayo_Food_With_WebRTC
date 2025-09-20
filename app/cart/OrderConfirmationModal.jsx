import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Calendar,
  Star,
  X,
  Truck,
  Store,
  UtensilsCrossed,
} from "lucide-react";

// Import your CSS module
import styles from "./OrderConfirmationModal.module.css";

export default function OrderConfirmationModal({ isOpen, onClose, orderData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const {
    cartItems,
    deliveryOption,
    selectedRestaurant,
    reservationData,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    paymentMethod,
    orderNumber = `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  } = orderData;

  const getDeliveryIcon = () => {
    switch (deliveryOption) {
      case "delivery":
        return <Truck className="text-blue-600" size={20} />;
      case "pickup":
        return <Store className="text-green-600" size={20} />;
      case "dine-in":
        return <UtensilsCrossed className="text-purple-600" size={20} />;
      default:
        return <Truck className="text-blue-600" size={20} />;
    }
  };

  const getEstimatedTime = () => {
    switch (deliveryOption) {
      case "delivery":
        return "30-45 minutes";
      case "pickup":
        return "15-25 minutes";
      case "dine-in":
        return reservationData.time || "As scheduled";
      default:
        return "30-45 minutes";
    }
  };

  const modalContent = (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button
            className={styles.closeButtonIcon}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <X size={24} />
          </button>
          <CheckCircle className={styles.successIcon} />
          <h2 id="modal-title" className={styles.title}>
            Order Confirmed!
          </h2>
          <p className={styles.subtitle}>
            Your order has been placed successfully
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Order Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <Clock className="text-blue-600" />
              Order Details
            </h3>
            <div className={styles.orderInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Order Number</span>
                <span className={styles.infoValue}>{orderNumber}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Order Type</span>
                <div className="flex items-center gap-2">
                  {getDeliveryIcon()}
                  <span className={styles.infoValue}>
                    {deliveryOption === "dine-in"
                      ? "Dine In"
                      : deliveryOption === "pickup"
                      ? "Pickup"
                      : "Delivery"}
                  </span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Estimated Time</span>
                <span className={styles.infoValue}>{getEstimatedTime()}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Payment Method</span>
                <span className={styles.infoValue}>
                  {paymentMethod === "card" ? "Credit Card" : "Cash"}
                </span>
              </div>
            </div>
          </div>

          {/* Reservation Details (if dine-in) */}
          {deliveryOption === "dine-in" && selectedRestaurant && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <UtensilsCrossed className="text-purple-600" />
                Reservation Details
              </h3>
              <div className={styles.reservationCard}>
                <div className={styles.restaurantInfo}>
                  <img
                    src={selectedRestaurant.image}
                    alt={selectedRestaurant.name}
                    className={styles.restaurantImage}
                  />
                  <div>
                    <h4 className={styles.restaurantName}>
                      {selectedRestaurant.name}
                    </h4>
                    <p className={styles.restaurantCuisine}>
                      {selectedRestaurant.cuisine}
                    </p>
                    <div className={styles.restaurantRating}>
                      <Star size={14} fill="currentColor" />
                      <span>{selectedRestaurant.rating}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.reservationGrid}>
                  <div className={styles.reservationItem}>
                    <Calendar size={16} className="text-blue-600" />
                    <span>{reservationData.date}</span>
                  </div>
                  <div className={styles.reservationItem}>
                    <Clock size={16} className="text-green-600" />
                    <span>{reservationData.time}</span>
                  </div>
                  <div className={styles.reservationItem}>
                    <Users size={16} className="text-purple-600" />
                    <span>
                      {reservationData.guests} Guest
                      {reservationData.guests > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className={styles.reservationItem}>
                    <Star size={16} className="text-yellow-600" />
                    <span>{reservationData.occasion || "Casual Dining"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <UtensilsCrossed className="text-orange-600" />
              Your Order
            </h3>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemDetails}>
                      Qty: {item.quantity} • From: {item.restaurant}
                    </p>
                  </div>
                  <span className={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <CheckCircle className="text-green-600" />
              Order Summary
            </h3>
            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalValue}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Delivery Fee</span>
                  <span className={styles.totalValue}>
                    ${deliveryFee.toFixed(2)}
                  </span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Tax</span>
                <span className={styles.totalValue}>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className={styles.totalRow}>
                  <span className="text-green-600 font-medium">Discount</span>
                  <span className="text-green-600 font-semibold">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className={styles.grandTotal}>
                <span className={styles.grandTotalLabel}>Total Paid</span>
                <span className={styles.grandTotalValue}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className="text-center text-gray-600 mb-4">
            Thank you for your order! You will receive a confirmation email
            shortly.
          </p>
          <button className={styles.closeButton} onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal in modal-hook div
  const modalRoot = document.getElementById("modal-hook");
  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
}
