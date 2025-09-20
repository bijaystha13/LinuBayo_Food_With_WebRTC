"use client";

import { useState } from "react";
import styles from "./Reservations.module.css";

const Reservations = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const restaurants = [
    {
      id: 1,
      name: "The Golden Spoon",
      cuisine: "Fine Dining",
      rating: 4.8,
      specialties: ["Steak", "Seafood", "Wine Pairing"],
      image: "/images/burger.jpg",
    },
    {
      id: 2,
      name: "Sakura Sushi",
      cuisine: "Japanese",
      rating: 4.7,
      specialties: ["Sushi", "Sashimi", "Ramen"],
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      name: "Mama Mia Pizzeria",
      cuisine: "Italian",
      rating: 4.6,
      specialties: ["Pizza", "Pasta", "Gelato"],
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      name: "Spice Garden",
      cuisine: "Indian",
      rating: 4.9,
      specialties: ["Curry", "Tandoori", "Naan"],
      image: "/api/placeholder/300/200",
    },
    {
      id: 5,
      name: "Le Petit Bistro",
      cuisine: "French",
      rating: 4.5,
      specialties: ["Croissant", "Escargot", "Coq au Vin"],
      image: "/api/placeholder/300/200",
    },
    {
      id: 6,
      name: "Dragon Palace",
      cuisine: "Chinese",
      rating: 4.4,
      specialties: ["Dim Sum", "Peking Duck", "Hot Pot"],
      image: "/api/placeholder/300/200",
    },
  ];

  const timeSlots = [
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
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservationData = {
      restaurant: selectedRestaurant,
      partySize,
      date: selectedDate,
      time: selectedTime,
      customerInfo,
    };
    console.log("Reservation Data:", reservationData);
    alert("Reservation submitted successfully!");
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Reserve Your Table</h1>
          <p className={styles.heroSubtitle}>
            Book a memorable dining experience at our partner restaurants
          </p>
        </div>
        <div className={styles.heroOverlay}></div>
      </div>

      <div className={styles.reservationSection}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.reservationForm}>
            {/* Restaurant Selection */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Choose Your Restaurant</h2>
              <div className={styles.restaurantGrid}>
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`${styles.restaurantCard} ${
                      selectedRestaurant === restaurant.name
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant.name)}
                  >
                    <div className={styles.restaurantImage}>
                      <img src={restaurant.image} alt={restaurant.name} />
                    </div>
                    <div className={styles.restaurantInfo}>
                      <h3 className={styles.restaurantName}>
                        {restaurant.name}
                      </h3>
                      <p className={styles.restaurantCuisine}>
                        {restaurant.cuisine}
                      </p>
                      <div className={styles.rating}>
                        <span className={styles.stars}>★★★★★</span>
                        <span className={styles.ratingNumber}>
                          {restaurant.rating}
                        </span>
                      </div>
                      <div className={styles.specialties}>
                        {restaurant.specialties.map((specialty, index) => (
                          <span key={index} className={styles.specialtyTag}>
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.selectIndicator}>
                      {selectedRestaurant === restaurant.name && <span>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Party Size and Date/Time */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Reservation Details</h2>
              <div className={styles.detailsGrid}>
                {/* Party Size */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Party Size</label>
                  <div className={styles.partySizeSelector}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`${styles.partySizeBtn} ${
                          partySize === size ? styles.active : ""
                        }`}
                        onClick={() => setPartySize(size)}
                      >
                        {size === 8 ? "8+" : size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="date">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className={styles.dateInput}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getTodayDate()}
                    required
                  />
                </div>

                {/* Time Selection */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Preferred Time</label>
                  <div className={styles.timeGrid}>
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`${styles.timeBtn} ${
                          selectedTime === time ? styles.active : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Your Information</h2>
              <div className={styles.customerInfoGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.textInput}
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.textInput}
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={styles.textInput}
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="specialRequests">
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    className={styles.textArea}
                    value={customerInfo.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Any dietary restrictions, allergies, or special occasions?"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className={styles.submitSection}>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!selectedRestaurant || !selectedDate || !selectedTime}
              >
                <span>Confirm Reservation</span>
                <span className={styles.submitIcon}>→</span>
              </button>
            </div>
          </form>

          {/* Reservation Summary */}
          {selectedRestaurant && selectedDate && selectedTime && (
            <div className={styles.reservationSummary}>
              <h3 className={styles.summaryTitle}>Reservation Summary</h3>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Restaurant:</span>
                  <span className={styles.summaryValue}>
                    {selectedRestaurant}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Date:</span>
                  <span className={styles.summaryValue}>{selectedDate}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Time:</span>
                  <span className={styles.summaryValue}>{selectedTime}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Party Size:</span>
                  <span className={styles.summaryValue}>
                    {partySize} {partySize === 1 ? "person" : "people"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservations;
