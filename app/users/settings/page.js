"use client";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import styles from "./userssettings.module.css";

const UserSettings = () => {
  const authCtx = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    menuUpdates: true,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
    shareAnalytics: false,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: "auto",
    language: "en",
    currency: "USD",
    timezone: "America/New_York",
    dietaryRestrictions: [],
    favoriteCategories: [],
  });

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  });

  useEffect(() => {
    // Load user settings from API
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load mock data
      setProfileData({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, City, State 12345",
        dateOfBirth: "1990-01-01",
        bio: "Food enthusiast and regular customer",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({
        type: "success",
        text: `${section} settings saved successfully!`,
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: `Failed to save ${section} settings` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ type: "", text: "" });
  };

  const renderProfileSettings = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Profile Information</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            className={styles.input}
            value={profileData.firstName}
            onChange={(e) =>
              setProfileData({ ...profileData, firstName: e.target.value })
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
              setProfileData({ ...profileData, lastName: e.target.value })
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            className={styles.input}
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Phone</label>
          <input
            type="tel"
            className={styles.input}
            value={profileData.phone}
            onChange={(e) =>
              setProfileData({ ...profileData, phone: e.target.value })
            }
          />
        </div>
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Address</label>
          <input
            type="text"
            className={styles.input}
            value={profileData.address}
            onChange={(e) =>
              setProfileData({ ...profileData, address: e.target.value })
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Date of Birth</label>
          <input
            type="date"
            className={styles.input}
            value={profileData.dateOfBirth}
            onChange={(e) =>
              setProfileData({ ...profileData, dateOfBirth: e.target.value })
            }
          />
        </div>
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Bio</label>
          <textarea
            className={styles.textarea}
            rows={4}
            value={profileData.bio}
            onChange={(e) =>
              setProfileData({ ...profileData, bio: e.target.value })
            }
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
      <button
        className={styles.saveButton}
        onClick={() => handleSave("Profile")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Notification Preferences</h2>
      <div className={styles.toggleGrid}>
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <label className={styles.toggleLabel}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <span className={styles.toggleDescription}>
                {getNotificationDescription(key)}
              </span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    [key]: e.target.checked,
                  })
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        ))}
      </div>
      <button
        className={styles.saveButton}
        onClick={() => handleSave("Notification")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Notifications"}
      </button>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Privacy & Data</h2>
      <div className={styles.toggleGrid}>
        {Object.entries(privacy).map(([key, value]) => (
          <div key={key} className={styles.toggleItem}>
            <div className={styles.toggleInfo}>
              <label className={styles.toggleLabel}>
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <span className={styles.toggleDescription}>
                {getPrivacyDescription(key)}
              </span>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setPrivacy({ ...privacy, [key]: e.target.checked })
                }
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        ))}
      </div>
      <button
        className={styles.saveButton}
        onClick={() => handleSave("Privacy")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Privacy Settings"}
      </button>
    </div>
  );

  const renderPreferences = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Preferences</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Theme</label>
          <select
            className={styles.select}
            value={preferences.theme}
            onChange={(e) =>
              setPreferences({ ...preferences, theme: e.target.value })
            }
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Language</label>
          <select
            className={styles.select}
            value={preferences.language}
            onChange={(e) =>
              setPreferences({ ...preferences, language: e.target.value })
            }
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Currency</label>
          <select
            className={styles.select}
            value={preferences.currency}
            onChange={(e) =>
              setPreferences({ ...preferences, currency: e.target.value })
            }
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Timezone</label>
          <select
            className={styles.select}
            value={preferences.timezone}
            onChange={(e) =>
              setPreferences({ ...preferences, timezone: e.target.value })
            }
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
      <button
        className={styles.saveButton}
        onClick={() => handleSave("Preferences")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Security</h2>
      <div className={styles.securitySection}>
        <h3 className={styles.subsectionTitle}>Change Password</h3>
        <div className={styles.formGrid}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Current Password</label>
            <input
              type="password"
              className={styles.input}
              value={security.currentPassword}
              onChange={(e) =>
                setSecurity({ ...security, currentPassword: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              className={styles.input}
              value={security.newPassword}
              onChange={(e) =>
                setSecurity({ ...security, newPassword: e.target.value })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              className={styles.input}
              value={security.confirmPassword}
              onChange={(e) =>
                setSecurity({ ...security, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>
        <button className={styles.secondaryButton}>Change Password</button>
      </div>

      <div className={styles.securitySection}>
        <h3 className={styles.subsectionTitle}>Two-Factor Authentication</h3>
        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <label className={styles.toggleLabel}>Enable 2FA</label>
            <span className={styles.toggleDescription}>
              Add an extra layer of security to your account
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={security.twoFactorEnabled}
              onChange={(e) =>
                setSecurity({ ...security, twoFactorEnabled: e.target.checked })
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>Danger Zone</h3>
        <div className={styles.dangerActions}>
          <button className={styles.dangerButton}>Delete Account</button>
          <span className={styles.dangerText}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </span>
        </div>
      </div>
    </div>
  );

  const getNotificationDescription = (key) => {
    const descriptions = {
      emailNotifications: "Receive notifications via email",
      smsNotifications: "Receive text message notifications",
      pushNotifications: "Browser and mobile push notifications",
      orderUpdates: "Updates about your orders",
      promotions: "Special offers and discounts",
      newsletter: "Monthly newsletter with food tips",
      menuUpdates: "New menu items and seasonal specials",
    };
    return descriptions[key] || "";
  };

  const getPrivacyDescription = (key) => {
    const descriptions = {
      profileVisible: "Make your profile visible to other users",
      showEmail: "Display your email on your public profile",
      showPhone: "Display your phone number on your profile",
      allowDataCollection: "Allow us to collect usage data to improve service",
      shareAnalytics: "Share anonymized data for analytics",
    };
    return descriptions[key] || "";
  };

  if (isLoading && activeTab === "profile" && !profileData.firstName) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loader}></div>
          <p>Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Manage your account preferences and settings
        </p>
      </div>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          <span className={styles.messageIcon}>
            {message.type === "success" ? "✅" : "❌"}
          </span>
          {message.text}
        </div>
      )}

      <div className={styles.settingsLayout}>
        <nav className={styles.sidebar}>
          <ul className={styles.tabList}>
            {[
              { id: "profile", label: "Profile", icon: "👤" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
              { id: "privacy", label: "Privacy", icon: "🔒" },
              { id: "preferences", label: "Preferences", icon: "⚙️" },
              { id: "security", label: "Security", icon: "🛡️" },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.active : ""
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className={styles.content}>
          {activeTab === "profile" && renderProfileSettings()}
          {activeTab === "notifications" && renderNotificationSettings()}
          {activeTab === "privacy" && renderPrivacySettings()}
          {activeTab === "preferences" && renderPreferences()}
          {activeTab === "security" && renderSecuritySettings()}
        </main>
      </div>
    </div>
  );
};

export default UserSettings;
