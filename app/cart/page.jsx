"use client";

import { useState } from "react";
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

export default function CartCheckout() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Fresh tomatoes, mozzarella, and basil",
      price: 18.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=200&fit=crop",
      restaurant: "Bella Vista",
    },
    {
      id: 2,
      name: "Chicken Teriyaki Bowl",
      description: "Grilled chicken with rice and vegetables",
      price: 15.5,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=200&fit=crop",
      restaurant: "Sakura Sushi",
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Crisp romaine with parmesan and croutons",
      price: 12.75,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop",
      restaurant: "The Garden Bistro",
    },
  ]);

  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    guests: "",
    occasion: "",
  });
  const [promoCode, setPromoCode] = useState("");
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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = deliveryOption === "delivery" ? 3.99 : 0;
  const tax = subtotal * 0.08;
  const discount = promoCode === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const handleCheckout = () => {
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

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        {/* Cart Section */}
        <div className={styles.cartSection}>
          {/* Cart Items */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <ShoppingCart className="text-orange-600" />
              Your Cart ({cartItems.length} items)
            </h2>

            {cartItems.length === 0 ? (
              <div className={styles.emptyCart}>
                <ShoppingCart className={styles.emptyCartIcon} />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemDescription}>
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        From: {item.restaurant}
                      </p>
                      <div className={styles.quantityControls}>
                        <div
                          className={styles.quantityBtn}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </div>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <div
                          className={styles.quantityBtn}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Truck className="text-orange-600" />
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
                <Truck className="text-orange-600" />
                <div>
                  <h4 className="font-semibold">Delivery</h4>
                  <p className="text-sm text-gray-600">30-45 mins • $3.99</p>
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
                <Store className="text-orange-600" />
                <div>
                  <h4 className="font-semibold">Pickup</h4>
                  <p className="text-sm text-gray-600">15-25 mins • Free</p>
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
                <Users className="text-orange-600" />
                <div>
                  <h4 className="font-semibold">Dine In</h4>
                  <p className="text-sm text-gray-600">
                    Make a reservation • Free
                  </p>
                </div>
              </div>
            </div>

            {/* Restaurant Reservation Section */}
            {deliveryOption === "dine-in" && (
              <div className={styles.reservationSection}>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
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
                      <div className="flex items-center">
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
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h5 className="font-semibold mb-3">
                      Reservation Details for {selectedRestaurant.name}
                    </h5>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Date</label>
                        <input
                          type="date"
                          className={styles.input}
                          value={reservationData.date}
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
        </div>

        {/* Checkout Section */}
        <div className={styles.checkoutSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <CreditCard className="text-orange-600" />
              Order Summary
            </h3>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
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
                <span className={styles.summaryLabel}>Tax</span>
                <span className={styles.summaryValue}>${tax.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className={styles.summaryRow}>
                  <span className={`${styles.summaryLabel} text-green-600`}>
                    Discount
                  </span>
                  <span className="font-semibold text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalValue}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className={styles.promoSection}>
              <div className={styles.promoInput}>
                <input
                  type="text"
                  placeholder="Promo code"
                  className={styles.input}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className={styles.promoButton}>Apply</button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Payment Method
              </h4>
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
                  <span className="font-medium">Card</span>
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
                  <span className="font-medium">Cash</span>
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
        }}
      />
    </div>
  );
}
