"use client";

import { useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Clock,
  Star,
  Camera,
  Edit3,
  Save,
  X,
} from "lucide-react";

// Mock CSS module import (in real Next.js, this would be: import styles from './UserProfile.module.css')
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: "",
    occasion: "",
  });

  const [userInfo, setUserInfo] = useState({
    name: "Sarah Johnson",
    title: "Food Enthusiast",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b300?w=300&h=300&fit=crop&crop=face",
  });

  const restaurants = [
    {
      id: 1,
      name: "Bella Vista",
      cuisine: "Italian Fine Dining",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
      priceRange: "$$$",
    },
    {
      id: 2,
      name: "Sakura Sushi",
      cuisine: "Japanese Authentic",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      priceRange: "$$$$",
    },
    {
      id: 3,
      name: "The Garden Bistro",
      cuisine: "Mediterranean",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      priceRange: "$$",
    },
    {
      id: 4,
      name: "Spice Route",
      cuisine: "Indian Fusion",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      priceRange: "$$",
    },
    {
      id: 5,
      name: "Le Petit Chef",
      cuisine: "French Cuisine",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      priceRange: "$$$$",
    },
    {
      id: 6,
      name: "Taco Libre",
      cuisine: "Mexican Street Food",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      priceRange: "$",
    },
  ];

  const userStats = [
    { number: "47", label: "Orders" },
    { number: "23", label: "Reviews" },
    { number: "12", label: "Favorites" },
    { number: "4.9", label: "Rating" },
  ];

  const timeSlots = [
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
  ];

  const occasions = [
    "Casual Dining",
    "Birthday Celebration",
    "Anniversary",
    "Business Meeting",
    "Date Night",
    "Family Gathering",
    "Special Occasion",
  ];

  const handleBookingSubmit = () => {
    if (
      selectedRestaurant &&
      bookingData.date &&
      bookingData.time &&
      bookingData.guests
    ) {
      alert(
        `Booking confirmed at ${selectedRestaurant.name} for ${bookingData.guests} guests on ${bookingData.date} at ${bookingData.time}`
      );
    } else {
      alert("Please fill in all booking details and select a restaurant");
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerOverlay}></div>

          <div
            className={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
          </div>

          <img
            src={userInfo.avatar}
            alt="Profile"
            className={styles.profileImage}
          />

          <div className={styles.profileInfo}>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  className={styles.input_edit}
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                  placeholder="Your Name"
                />
                <input
                  className={styles.input_edit}
                  value={userInfo.title}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, title: e.target.value })
                  }
                  placeholder="Your Title"
                />
              </div>
            ) : (
              <>
                <h1 className={styles.profileName}>{userInfo.name}</h1>
                <p className={styles.profileTitle}>{userInfo.title}</p>
              </>
            )}
          </div>
        </div>

        <div className={styles.content}>
          {/* User Stats */}
          <div className={styles.section}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {userStats.map((stat, index) => (
                <div
                  key={index}
                  className={`${styles.infoCard} ${styles.statsCard}`}
                >
                  <div className={styles.statsNumber}>{stat.number}</div>
                  <div className={styles.statsLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <User className="text-orange-600" />
              Personal Information
            </h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  <Mail size={16} />
                  Email
                </div>
                {isEditing ? (
                  <input
                    className={styles.input}
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />
                ) : (
                  <div className={styles.infoValue}>{userInfo.email}</div>
                )}
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  <Phone size={16} />
                  Phone
                </div>
                {isEditing ? (
                  <input
                    className={styles.input}
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className={styles.infoValue}>{userInfo.phone}</div>
                )}
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  <MapPin size={16} />
                  Location
                </div>
                {isEditing ? (
                  <input
                    className={styles.input}
                    value={userInfo.location}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, location: e.target.value })
                    }
                  />
                ) : (
                  <div className={styles.infoValue}>{userInfo.location}</div>
                )}
              </div>
            </div>
          </div>

          {/* Restaurant Booking Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Calendar className="text-orange-600" />
              Make a Reservation
            </h2>

            <div className={styles.bookingSection}>
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Choose Your Restaurant
              </h3>

              <div className={styles.restaurantGrid}>
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`${styles.restaurantCard} ${
                      selectedRestaurant?.id === restaurant.id
                        ? styles.selectedRestaurant
                        : ""
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  >
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className={styles.restaurantImage}
                    />
                    <div className={styles.restaurantInfo}>
                      <h4 className={styles.restaurantName}>
                        {restaurant.name}
                      </h4>
                      <p className={styles.restaurantCuisine}>
                        {restaurant.cuisine}
                      </p>
                      <div className={styles.restaurantRating}>
                        <Star size={16} fill="currentColor" />
                        <span className="text-gray-700 ml-1">
                          {restaurant.rating}
                        </span>
                        <span className="text-gray-500 ml-2">
                          {restaurant.priceRange}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRestaurant && (
                <div className={styles.bookingForm}>
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">
                    Booking Details for {selectedRestaurant.name}
                  </h4>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Date</label>
                      <input
                        type="date"
                        className={styles.input}
                        value={bookingData.date}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Time</label>
                      <select
                        className={styles.select}
                        value={bookingData.time}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
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
                      <label className={styles.label}>Number of Guests</label>
                      <select
                        className={styles.select}
                        value={bookingData.guests}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            guests: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Guests</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Occasion</label>
                      <select
                        className={styles.select}
                        value={bookingData.occasion}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
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

                  <button
                    className={styles.bookButton}
                    onClick={handleBookingSubmit}
                  >
                    Confirm Reservation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
