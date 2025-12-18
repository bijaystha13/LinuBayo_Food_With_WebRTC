"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Clock,
  CreditCard,
  Truck,
  Store,
  Star,
  Gift,
  Users,
} from "lucide-react";

import styles from "./Cart.module.css";
import OrderConfirmationModal from "./OrderConfirmationModal";
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
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [savedCard, setSavedCard] = useState(null);

  // Load saved card from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("savedCardDetails");
    if (stored) {
      setSavedCard(JSON.parse(stored));
    }
  }, []);

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
  ];

  const timeSlots = [
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];
  const occasions = ["Casual Dining", "Birthday", "Anniversary", "Date Night"];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardDetails({ ...cardDetails, expiryDate: formatted });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const saveCardDetails = () => {
    const cardToSave = {
      cardNumber: cardDetails.cardNumber,
      cardName: cardDetails.cardName,
      expiryDate: cardDetails.expiryDate,
      lastFour: cardDetails.cardNumber.slice(-4),
    };
    localStorage.setItem("savedCardDetails", JSON.stringify(cardToSave));
    setSavedCard(cardToSave);
    alert("Card saved successfully!");
  };

  const removeSavedCard = () => {
    localStorage.removeItem("savedCardDetails");
    setSavedCard(null);
    setCardDetails({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
  };

  const useSavedCard = () => {
    if (savedCard) {
      setCardDetails({
        cardNumber: savedCard.cardNumber,
        cardName: savedCard.cardName,
        expiryDate: savedCard.expiryDate,
        cvv: "",
      });
    }
  };

  const applyPromoCode = () => {
    const validPromoCodes = { SAVE10: 0.1, FIRST15: 0.15, WELCOME20: 0.2 };
    if (validPromoCodes[promoCode.toUpperCase()]) {
      setAppliedPromo(promoCode.toUpperCase());
    } else {
      alert("Invalid promo code");
    }
    setPromoCode("");
  };

  const subtotal = getCartTotal();
  const deliveryFee = deliveryOption === "delivery" ? 3.99 : 0;
  const tax = subtotal * 0.08;
  const discount = appliedPromo
    ? subtotal * { SAVE10: 0.1, FIRST15: 0.15, WELCOME20: 0.2 }[appliedPromo]
    : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (
      deliveryOption === "dine-in" &&
      (!selectedRestaurant ||
        !reservationData.date ||
        !reservationData.time ||
        !reservationData.guests)
    ) {
      alert("Please complete reservation details");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.cardName ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv
      ) {
        alert("Please complete all card details");
        return;
      }
      if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
      if (cardDetails.cvv.length < 3) {
        alert("Please enter a valid CVV");
        return;
      }
    }

    setShowOrderModal(true);
  };

  useEffect(() => {
    if (
      deliveryOption === "dine-in" &&
      !selectedRestaurant &&
      restaurants.length > 0
    ) {
      setSelectedRestaurant(restaurants[0]);
    }
  }, [deliveryOption]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Cart Items */}
        <div className={styles.card}>
          <h2 className={styles.title}>
            <ShoppingCart size={24} />
            Cart ({getCartItemsCount()})
          </h2>

          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingCart size={64} />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className={styles.items}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImg}
                  />
                  <div className={styles.itemInfo}>
                    <h3>{item.name}</h3>
                    <p>{item.restaurant}</p>
                    <div className={styles.itemMeta}>
                      <Clock size={12} />
                      <span>{item.cookTime}m</span>
                      {item.rating && (
                        <>
                          <Star size={12} />
                          <span>{item.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <p className={styles.price}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className={styles.qty}>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      className={styles.remove}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delivery & Checkout */}
        <div>
          {cartItems.length > 0 && (
            <>
              <div className={styles.card}>
                <h3 className={styles.title}>
                  <Truck size={20} />
                  Delivery
                </h3>
                <div className={styles.options}>
                  {[
                    {
                      type: "delivery",
                      icon: Truck,
                      label: "Delivery",
                      desc: "30-45m • $3.99",
                    },
                    {
                      type: "pickup",
                      icon: Store,
                      label: "Pickup",
                      desc: "15-25m • Free",
                    },
                    {
                      type: "dine-in",
                      icon: Users,
                      label: "Dine In",
                      desc: "Reserve • Free",
                    },
                  ].map(({ type, icon: Icon, label, desc }) => (
                    <div
                      key={type}
                      className={`${styles.option} ${
                        deliveryOption === type ? styles.active : ""
                      }`}
                      onClick={() => setDeliveryOption(type)}
                    >
                      <Icon size={20} />
                      <div>
                        <h4>{label}</h4>
                        <p>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {deliveryOption === "dine-in" && (
                  <div className={styles.reservation}>
                    <div className={styles.restaurants}>
                      {restaurants.map((r) => (
                        <div
                          key={r.id}
                          className={`${styles.restaurant} ${
                            selectedRestaurant?.id === r.id ? styles.active : ""
                          }`}
                          onClick={() => setSelectedRestaurant(r)}
                        >
                          <img src={r.image} alt={r.name} />
                          <div>
                            <h5>{r.name}</h5>
                            <p>{r.cuisine}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedRestaurant && (
                      <div className={styles.form}>
                        <input
                          type="date"
                          value={reservationData.date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setReservationData({
                              ...reservationData,
                              date: e.target.value,
                            })
                          }
                        />
                        <select
                          value={reservationData.time}
                          onChange={(e) =>
                            setReservationData({
                              ...reservationData,
                              time: e.target.value,
                            })
                          }
                        >
                          <option value="">Time</option>
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <select
                          value={reservationData.guests}
                          onChange={(e) =>
                            setReservationData({
                              ...reservationData,
                              guests: e.target.value,
                            })
                          }
                        >
                          <option value="">Guests</option>
                          {[...Array(8)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <h3 className={styles.title}>
                  <CreditCard size={20} />
                  Summary
                </h3>

                <div className={styles.summary}>
                  <div className={styles.row}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className={styles.row}>
                      <span>Delivery</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className={styles.row}>
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className={styles.row}>
                      <span>Discount ({appliedPromo})</span>
                      <span className={styles.discount}>
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className={styles.total}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {!appliedPromo && (
                  <div className={styles.promo}>
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={!promoCode.trim()}
                    >
                      Apply
                    </button>
                  </div>
                )}

                <div className={styles.payment}>
                  <h4>Payment</h4>
                  <div className={styles.methods}>
                    <div
                      className={`${styles.method} ${
                        paymentMethod === "card" ? styles.active : ""
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <CreditCard size={18} />
                      <span>Card</span>
                    </div>
                    <div
                      className={`${styles.method} ${
                        paymentMethod === "cash" ? styles.active : ""
                      }`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <Gift size={18} />
                      <span>Cash</span>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className={styles.cardForm}>
                      {savedCard && (
                        <div className={styles.savedCard}>
                          <div>
                            <p>💳 •••• {savedCard.lastFour}</p>
                            <span>{savedCard.cardName}</span>
                          </div>
                          <div className={styles.savedActions}>
                            <button onClick={useSavedCard}>Use</button>
                            <button
                              onClick={removeSavedCard}
                              className={styles.removeCard}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength="19"
                      />
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.cardName}
                        onChange={(e) =>
                          setCardDetails({
                            ...cardDetails,
                            cardName: e.target.value,
                          })
                        }
                      />
                      <div className={styles.cardRow}>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleExpiryChange}
                          maxLength="5"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={handleCvvChange}
                          maxLength="4"
                        />
                      </div>
                      {!savedCard &&
                        cardDetails.cardNumber &&
                        cardDetails.cardName && (
                          <button
                            className={styles.saveCard}
                            onClick={saveCardDetails}
                          >
                            Save Card
                          </button>
                        )}
                    </div>
                  )}
                </div>

                <button className={styles.checkout} onClick={handleCheckout}>
                  Place Order • ${total.toFixed(2)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

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
