"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Clock,
  Users,
  Calendar,
  CreditCard,
  Truck,
  Store,
  Star,
  Gift,
  Percent,
} from "lucide-react";

// Import your CSS module
import styles from "./Cart.module.css";

// Import the modal component
import OrderConfirmationModal from "./OrderConfirmationModal";

// Import cart context
import { useCart } from "@/app/shared/Context/CartContext";

export default function CartCheckout() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    occasion: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showOrderModal, setShowOrderModal] = useState(false);

  const restaurants = [
    {
      id: 1,
      name: "Bella Vista",
      cuisine: "Italian",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      name: "Sakura Sushi",
      cuisine: "Japanese",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      name: "The Garden Bistro",
      cuisine: "Mediterranean",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
    },
    {
      id: 4,
      name: "Spice Route",
      cuisine: "Indian",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=100&h=100&fit=crop",
    },
  ];

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  const occasions = [
    "Casual Dining",
    "Birthday",
    "Anniversary",
    "Business Meeting",
    "Date Night",
    "Family Gathering",
  ];

  // Handle quantity update
  const handleUpdateQuantity = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  // Handle item removal
  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  // Apply promo code
  const applyPromoCode = () => {
    const validPromoCodes = {
      SAVE10: 0.1,
      FIRST15: 0.15,
      WELCOME20: 0.2,
      STUDENT5: 0.05,
    };

    if (validPromoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCode.toUpperCase());
      alert(`Promo code ${promoCode.toUpperCase()} applied successfully!`);
    } else {
      alert("Invalid promo code. Please try again.");
    }
    setPromoCode("");
  };

  // Clear applied promo
  const clearPromo = () => {
    setAppliedPromo("");
  };

  // Calculate totals using cart context
  const subtotal = getCartTotal();
  const deliveryFee = deliveryOption === "delivery" ? 3.99 : 0;
  const tax = subtotal * 0.08;

  // Apply discount based on promo code
  const getDiscountRate = (code) => {
    const rates = {
      SAVE10: 0.1,
      FIRST15: 0.15,
      WELCOME20: 0.2,
      STUDENT5: 0.05,
    };
    return rates[code] || 0;
  };

  const discount = appliedPromo ? subtotal * getDiscountRate(appliedPromo) : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    if (
      deliveryOption === "dine-in" &&
      (!selectedRestaurant ||
        !reservationData.date ||
        !reservationData.time ||
        !reservationData.guests)
    ) {
      alert("Please complete your reservation details for dine-in");
      return;
    }

    // Show the order confirmation modal
    setShowOrderModal(true);
  };

  // Auto-select default restaurant if dine-in is selected and no restaurant is chosen
  useEffect(() => {
    if (
      deliveryOption === "dine-in" &&
      !selectedRestaurant &&
      restaurants.length > 0
    ) {
      setSelectedRestaurant(restaurants[0]);
    }
  }, [deliveryOption, selectedRestaurant]);

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        {/* Cart Section */}
        <div className={styles.cartSection}>
          {/* Cart Items */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <ShoppingCart />
              Your Cart ({getCartItemsCount()} items)
            </h2>

            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <ShoppingCart className={styles.emptyCartIcon} />
                <p className={styles.emptyCartText}>Your cart is empty</p>
                <p className={styles.summaryLabel}>
                  Add some delicious items from our menu to get started!
                </p>
              </div>
            ) : (
              <div className={styles.cartItemsContainer}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                      onError={(e) => {
                        e.target.src = "/placeholder-food.jpg";
                      }}
                    />
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                      <p className={styles.summaryValue}>
                        From: {item.restaurant}
                      </p>
                      <div className={styles.itemDetails}>
                        <Clock size={14} />
                        <span className={styles.itemDetailText}>
                          {item.cookTime} mins
                        </span>
                        {item.rating && (
                          <>
                            <Star size={14} className={styles.starIcon} />
                            <span className={styles.itemDetailText}>
                              {item.rating}
                            </span>
                          </>
                        )}
                      </div>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <p className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className={styles.summaryValue}>
                        ${item.price.toFixed(2)} each
                      </p>
                      <button
                        className={styles.removeBtn}
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Options - Only show if cart has items */}
          {cartItems.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>
                <Truck />
                Delivery Options
              </h3>

              <div className={styles.deliveryOptions}>
                <div
                  className={`${styles.deliveryOption} ${
                    deliveryOption === "delivery"
                      ? styles.deliveryOptionActive
                      : styles.deliveryOptionInactive
                  }`}
                  onClick={() => setDeliveryOption("delivery")}
                >
                  <Truck />
                  <div>
                    <h4 className={styles.deliveryOptionTitle}>Delivery</h4>
                    <p className={styles.deliveryOptionDesc}>
                      30-45 mins • $3.99
                    </p>
                  </div>
                </div>

                <div
                  className={`${styles.deliveryOption} ${
                    deliveryOption === "pickup"
                      ? styles.deliveryOptionActive
                      : styles.deliveryOptionInactive
                  }`}
                  onClick={() => setDeliveryOption("pickup")}
                >
                  <Store />
                  <div>
                    <h4 className={styles.deliveryOptionTitle}>Pickup</h4>
                    <p className={styles.deliveryOptionDesc}>
                      15-25 mins • Free
                    </p>
                  </div>
                </div>

                <div
                  className={`${styles.deliveryOption} ${
                    deliveryOption === "dine-in"
                      ? styles.deliveryOptionActive
                      : styles.deliveryOptionInactive
                  }`}
                  onClick={() => setDeliveryOption("dine-in")}
                >
                  <Users />
                  <div>
                    <h4 className={styles.deliveryOptionTitle}>Dine In</h4>
                    <p className={styles.deliveryOptionDesc}>
                      Make a reservation • Free
                    </p>
                  </div>
                </div>
              </div>

              {/* Restaurant Reservation Section */}
              {deliveryOption === "dine-in" && (
                <div className={styles.reservationSection}>
                  <h4 className={styles.reservationTitle}>
                    Choose Restaurant & Make Reservation
                  </h4>

                  <div className={styles.restaurantGrid}>
                    {restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className={`${styles.restaurantCard} ${
                          selectedRestaurant?.id === restaurant.id
                            ? styles.restaurantActive
                            : styles.restaurantInactive
                        }`}
                        onClick={() => setSelectedRestaurant(restaurant)}
                      >
                        <div className={styles.restaurantCardContent}>
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className={styles.restaurantImage}
                          />
                          <div className={styles.restaurantInfo}>
                            <h5 className={styles.restaurantName}>
                              {restaurant.name}
                            </h5>
                            <p className={styles.restaurantCuisine}>
                              {restaurant.cuisine}
                            </p>
                            <div className={styles.restaurantRating}>
                              <Star size={14} fill="currentColor" />
                              <span>{restaurant.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedRestaurant && (
                    <div className={styles.reservationForm}>
                      <h5 className={styles.reservationFormTitle}>
                        Reservation Details for {selectedRestaurant.name}
                      </h5>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Date</label>
                          <input
                            type="date"
                            className={styles.input}
                            value={reservationData.date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) =>
                              setReservationData({
                                ...reservationData,
                                date: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Time</label>
                          <select
                            className={styles.select}
                            value={reservationData.time}
                            onChange={(e) =>
                              setReservationData({
                                ...reservationData,
                                time: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Time</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Guests</label>
                          <select
                            className={styles.select}
                            value={reservationData.guests}
                            onChange={(e) =>
                              setReservationData({
                                ...reservationData,
                                guests: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Guests</option>
                            {[...Array(12)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} Guest{i + 1 > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Occasion</label>
                          <select
                            className={styles.select}
                            value={reservationData.occasion}
                            onChange={(e) =>
                              setReservationData({
                                ...reservationData,
                                occasion: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Occasion</option>
                            {occasions.map((occasion) => (
                              <option key={occasion} value={occasion}>
                                {occasion}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        <div className={styles.checkoutSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <CreditCard />
              Order Summary
            </h3>

            {cartItems.length === 0 ? (
              <div className={styles.emptyCheckout}>
                <ShoppingCart size={48} />
                <h3>Your cart is empty</h3>
                <p>Add items to see your order summary</p>
              </div>
            ) : (
              <>
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>
                      Subtotal ({getCartItemsCount()} items)
                    </span>
                    <span className={styles.summaryValue}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {deliveryOption === "delivery" && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>Delivery Fee</span>
                      <span className={styles.summaryValue}>
                        ${deliveryFee.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Tax (8%)</span>
                    <span className={styles.summaryValue}>
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.discountLabel}>
                        Discount ({appliedPromo})
                        <button
                          onClick={clearPromo}
                          className={styles.promoRemove}
                          title="Remove promo code"
                        >
                          ×
                        </button>
                      </span>
                      <span className={styles.discountValue}>
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Promo Code */}
                {!appliedPromo && (
                  <div className={styles.promoSection}>
                    <div className={styles.promoInput}>
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        className={styles.input}
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                      />
                      <button
                        className={styles.promoButton}
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </button>
                    </div>
                    <div className={styles.summaryValue}>
                      Try: SAVE10, FIRST15, WELCOME20, STUDENT5
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                <div className={styles.paymentSection}>
                  <h4 className={styles.summaryValue}>Payment Method</h4>
                  <div className={styles.paymentMethods}>
                    <div
                      className={`${styles.paymentMethod} ${
                        paymentMethod === "card"
                          ? styles.paymentActive
                          : styles.paymentInactive
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={20} />
                      <span className={styles.paymentMethodText}>Card</span>
                    </div>
                    <div
                      className={`${styles.paymentMethod} ${
                        paymentMethod === "cash"
                          ? styles.paymentActive
                          : styles.paymentInactive
                      }`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <Gift size={20} />
                      <span className={styles.paymentMethodText}>Cash</span>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Place Order • ${total.toFixed(2)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        orderData={{
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
          appliedPromo,
        }}
      />
    </div>
  );
}
