"use client";

import React, { useState } from "react";
import {
  User,
  Bell,
  MapPin,
  CreditCard,
  Shield,
  Globe,
  Heart,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import styles from "./Settings.module.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
  });

  const [preferences, setPreferences] = useState({
    favoriteRestaurants: ["Italian Bistro", "Sushi House"],
    defaultPartySize: 2,
    preferredTimeSlots: ["7:00 PM", "8:00 PM"],
    dietaryRestrictions: ["Vegetarian"],
    notifications: {
      reservationReminders: true,
      promotionalEmails: false,
      smsAlerts: true,
    },
  });

  const [reservationDefaults, setReservationDefaults] = useState({
    partySize: 2,
    preferredTime: "7:00 PM",
    specialRequests: "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "reservations", label: "Reservations", icon: Calendar },
    { id: "preferences", label: "Preferences", icon: Heart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ];

  const restaurants = [
    { id: 1, name: "Italian Bistro", cuisine: "Italian", rating: 4.8 },
    { id: 2, name: "Sushi House", cuisine: "Japanese", rating: 4.9 },
    { id: 3, name: "French Corner", cuisine: "French", rating: 4.7 },
    { id: 4, name: "BBQ Paradise", cuisine: "American", rating: 4.6 },
    { id: 5, name: "Thai Garden", cuisine: "Thai", rating: 4.8 },
    { id: 6, name: "Mexican Fiesta", cuisine: "Mexican", rating: 4.5 },
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
    "10:00 PM",
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRestaurantToggle = (restaurantName) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteRestaurants: prev.favoriteRestaurants.includes(restaurantName)
        ? prev.favoriteRestaurants.filter((r) => r !== restaurantName)
        : [...prev.favoriteRestaurants, restaurantName],
    }));
  };

  const handleTimeSlotToggle = (timeSlot) => {
    setPreferences((prev) => ({
      ...prev,
      preferredTimeSlots: prev.preferredTimeSlots.includes(timeSlot)
        ? prev.preferredTimeSlots.filter((t) => t !== timeSlot)
        : [...prev.preferredTimeSlots, timeSlot],
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>First Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={profileData.firstName}
                  onChange={(e) =>
                    handleProfileUpdate("firstName", e.target.value)
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Last Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={profileData.lastName}
                  onChange={(e) =>
                    handleProfileUpdate("lastName", e.target.value)
                  }
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  className={styles.input}
                  value={profileData.email}
                  onChange={(e) => handleProfileUpdate("email", e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Phone</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={profileData.phone}
                  onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  className={styles.input}
                  value={profileData.address}
                  onChange={(e) =>
                    handleProfileUpdate("address", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case "reservations":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>
              Default Reservation Settings
            </h2>

            <div className={styles.settingsSection}>
              <h3 className={styles.subsectionTitle}>
                <Users className={styles.icon} />
                Default Party Size
              </h3>
              <div className={styles.partySizeSelector}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                  <button
                    key={size}
                    className={`${styles.partySizeBtn} ${
                      reservationDefaults.partySize === size
                        ? styles.active
                        : ""
                    }`}
                    onClick={() =>
                      setReservationDefaults((prev) => ({
                        ...prev,
                        partySize: size,
                      }))
                    }
                  >
                    {size} {size === 1 ? "Guest" : "Guests"}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <h3 className={styles.subsectionTitle}>
                <Clock className={styles.icon} />
                Preferred Time Slots
              </h3>
              <div className={styles.timeSlotGrid}>
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    className={`${styles.timeSlot} ${
                      preferences.preferredTimeSlots.includes(time)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleTimeSlotToggle(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <h3 className={styles.subsectionTitle}>
                Special Requests Template
              </h3>
              <textarea
                className={styles.textarea}
                placeholder="Enter any default special requests for reservations..."
                value={reservationDefaults.specialRequests}
                onChange={(e) =>
                  setReservationDefaults((prev) => ({
                    ...prev,
                    specialRequests: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Food Preferences</h2>

            <div className={styles.settingsSection}>
              <h3 className={styles.subsectionTitle}>Favorite Restaurants</h3>
              <div className={styles.restaurantGrid}>
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`${styles.restaurantCard} ${
                      preferences.favoriteRestaurants.includes(restaurant.name)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => handleRestaurantToggle(restaurant.name)}
                  >
                    <div className={styles.restaurantInfo}>
                      <h4 className={styles.restaurantName}>
                        {restaurant.name}
                      </h4>
                      <p className={styles.restaurantCuisine}>
                        {restaurant.cuisine}
                      </p>
                      <div className={styles.rating}>
                        ⭐ {restaurant.rating}
                      </div>
                    </div>
                    <div className={styles.selectIndicator}>
                      {preferences.favoriteRestaurants.includes(
                        restaurant.name
                      ) && <Heart className={styles.heartIcon} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <h3 className={styles.subsectionTitle}>Dietary Restrictions</h3>
              <div className={styles.checkboxGroup}>
                {[
                  "Vegetarian",
                  "Vegan",
                  "Gluten-Free",
                  "Dairy-Free",
                  "Nut-Free",
                  "Halal",
                  "Kosher",
                ].map((restriction) => (
                  <label key={restriction} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={preferences.dietaryRestrictions.includes(
                        restriction
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences((prev) => ({
                            ...prev,
                            dietaryRestrictions: [
                              ...prev.dietaryRestrictions,
                              restriction,
                            ],
                          }));
                        } else {
                          setPreferences((prev) => ({
                            ...prev,
                            dietaryRestrictions:
                              prev.dietaryRestrictions.filter(
                                (d) => d !== restriction
                              ),
                          }));
                        }
                      }}
                    />
                    <span className={styles.checkmark}></span>
                    {restriction}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Notification Preferences</h2>

            <div className={styles.notificationGroup}>
              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Reservation Reminders</h3>
                  <p>Get notified about upcoming reservations</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.reservationReminders}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          reservationReminders: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>Promotional Emails</h3>
                  <p>Receive special offers and restaurant promotions</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.promotionalEmails}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          promotionalEmails: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.notificationItem}>
                <div className={styles.notificationInfo}>
                  <h3>SMS Alerts</h3>
                  <p>Get text messages for important updates</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications.smsAlerts}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          smsAlerts: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return <div className={styles.tabContent}>Content coming soon...</div>;
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your account preferences and reservations
        </p>
      </div>

      <div className={styles.settingsLayout}>
        <div className={styles.sidebar}>
          <nav className={styles.tabNavigation}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className={styles.tabIcon} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.content}>
          {renderTabContent()}

          <div className={styles.actionButtons}>
            <button className={styles.saveButton}>Save Changes</button>
            <button className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
