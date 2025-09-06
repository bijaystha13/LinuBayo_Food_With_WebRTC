"use client";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import styles from "./AdminSettings.module.css";

const AdminSettings = () => {
  const authCtx = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Admin Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    adminLevel: "",
    department: "",
    bio: "",
    emergencyContact: "",
  });

  // System Configuration
  const [systemConfig, setSystemConfig] = useState({
    siteMaintenance: false,
    newUserRegistration: true,
    emailNotifications: true,
    autoBackup: true,
    debugMode: false,
    apiRateLimit: 1000,
    sessionTimeout: 30,
    maxFileSize: 10,
  });

  // User Management Settings
  const [userManagement, setUserManagement] = useState({
    autoApproveUsers: false,
    requireEmailVerification: true,
    allowGuestOrders: true,
    maxOrdersPerDay: 50,
    defaultUserRole: "user",
    passwordComplexity: "medium",
  });

  // Restaurant Settings
  const [restaurantSettings, setRestaurantSettings] = useState({
    restaurantName: "LinuBayo Food",
    businessHours: {
      monday: { open: "09:00", close: "22:00", closed: false },
      tuesday: { open: "09:00", close: "22:00", closed: false },
      wednesday: { open: "09:00", close: "22:00", closed: false },
      thursday: { open: "09:00", close: "22:00", closed: false },
      friday: { open: "09:00", close: "23:00", closed: false },
      saturday: { open: "10:00", close: "23:00", closed: false },
      sunday: { open: "10:00", close: "21:00", closed: false },
    },
    deliveryRadius: 15,
    deliveryFee: 3.99,
    minOrderAmount: 15.0,
    taxRate: 8.5,
    currency: "USD",
  });

  // Security Settings
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
    adminSessionTimeout: 60,
    ipWhitelist: "",
    loginAttempts: 5,
    lockoutDuration: 15,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    newOrderAlert: true,
    lowStockAlert: true,
    systemErrorAlert: true,
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: false,
    emergencyAlerts: true,
    maintenanceNotifications: true,
  });

  useEffect(() => {
    loadAdminSettings();
  }, []);

  const loadAdminSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load mock admin data
      setProfileData({
        firstName: "Admin",
        lastName: "User",
        email: "admin@linubayofood.com",
        phone: "+1 (555) 987-6543",
        adminLevel: "Super Admin",
        department: "IT Management",
        bio: "System administrator with 5+ years experience",
        emergencyContact: "+1 (555) 123-0000",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load admin settings" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({
        type: "success",
        text: `${section} settings saved successfully!`,
      });

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
      <h2 className={styles.sectionTitle}>Admin Profile</h2>
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
        <div className={styles.inputGroup}>
          <label className={styles.label}>Admin Level</label>
          <select
            className={styles.select}
            value={profileData.adminLevel}
            onChange={(e) =>
              setProfileData({ ...profileData, adminLevel: e.target.value })
            }
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Department</label>
          <select
            className={styles.select}
            value={profileData.department}
            onChange={(e) =>
              setProfileData({ ...profileData, department: e.target.value })
            }
          >
            <option value="IT Management">IT Management</option>
            <option value="Operations">Operations</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <label className={styles.label}>Emergency Contact</label>
          <input
            type="tel"
            className={styles.input}
            value={profileData.emergencyContact}
            onChange={(e) =>
              setProfileData({
                ...profileData,
                emergencyContact: e.target.value,
              })
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
            placeholder="Admin description and responsibilities..."
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

  const renderSystemConfig = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>System Configuration</h2>

      <div className={styles.configSection}>
        <h3 className={styles.subsectionTitle}>General Settings</h3>
        <div className={styles.toggleGrid}>
          {Object.entries(systemConfig)
            .filter(([key]) =>
              [
                "siteMaintenance",
                "newUserRegistration",
                "emailNotifications",
                "autoBackup",
                "debugMode",
              ].includes(key)
            )
            .map(([key, value]) => (
              <div key={key} className={styles.toggleItem}>
                <div className={styles.toggleInfo}>
                  <label className={styles.toggleLabel}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <span className={styles.toggleDescription}>
                    {getSystemConfigDescription(key)}
                  </span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setSystemConfig({
                        ...systemConfig,
                        [key]: e.target.checked,
                      })
                    }
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.subsectionTitle}>Performance Settings</h3>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              API Rate Limit (requests/hour)
            </label>
            <input
              type="number"
              className={styles.input}
              value={systemConfig.apiRateLimit}
              onChange={(e) =>
                setSystemConfig({
                  ...systemConfig,
                  apiRateLimit: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Session Timeout (minutes)</label>
            <input
              type="number"
              className={styles.input}
              value={systemConfig.sessionTimeout}
              onChange={(e) =>
                setSystemConfig({
                  ...systemConfig,
                  sessionTimeout: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Max File Size (MB)</label>
            <input
              type="number"
              className={styles.input}
              value={systemConfig.maxFileSize}
              onChange={(e) =>
                setSystemConfig({
                  ...systemConfig,
                  maxFileSize: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <button
        className={styles.saveButton}
        onClick={() => handleSave("System Configuration")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Configuration"}
      </button>
    </div>
  );

  const renderUserManagement = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>User Management</h2>
      <div className={styles.toggleGrid}>
        {Object.entries(userManagement)
          .filter(([key]) =>
            [
              "autoApproveUsers",
              "requireEmailVerification",
              "allowGuestOrders",
            ].includes(key)
          )
          .map(([key, value]) => (
            <div key={key} className={styles.toggleItem}>
              <div className={styles.toggleInfo}>
                <label className={styles.toggleLabel}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <span className={styles.toggleDescription}>
                  {getUserManagementDescription(key)}
                </span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setUserManagement({
                      ...userManagement,
                      [key]: e.target.checked,
                    })
                  }
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          ))}
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Max Orders Per Day</label>
          <input
            type="number"
            className={styles.input}
            value={userManagement.maxOrdersPerDay}
            onChange={(e) =>
              setUserManagement({
                ...userManagement,
                maxOrdersPerDay: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Default User Role</label>
          <select
            className={styles.select}
            value={userManagement.defaultUserRole}
            onChange={(e) =>
              setUserManagement({
                ...userManagement,
                defaultUserRole: e.target.value,
              })
            }
          >
            <option value="user">User</option>
            <option value="premium">Premium User</option>
            <option value="vip">VIP User</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password Complexity</label>
          <select
            className={styles.select}
            value={userManagement.passwordComplexity}
            onChange={(e) =>
              setUserManagement({
                ...userManagement,
                passwordComplexity: e.target.value,
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <button
        className={styles.saveButton}
        onClick={() => handleSave("User Management")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save User Settings"}
      </button>
    </div>
  );

  const renderRestaurantSettings = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Restaurant Configuration</h2>

      <div className={styles.configSection}>
        <h3 className={styles.subsectionTitle}>Basic Information</h3>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Restaurant Name</label>
            <input
              type="text"
              className={styles.input}
              value={restaurantSettings.restaurantName}
              onChange={(e) =>
                setRestaurantSettings({
                  ...restaurantSettings,
                  restaurantName: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Currency</label>
            <select
              className={styles.select}
              value={restaurantSettings.currency}
              onChange={(e) =>
                setRestaurantSettings({
                  ...restaurantSettings,
                  currency: e.target.value,
                })
              }
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Delivery Radius (km)</label>
            <input
              type="number"
              className={styles.input}
              value={restaurantSettings.deliveryRadius}
              onChange={(e) =>
                setRestaurantSettings({
                  ...restaurantSettings,
                  deliveryRadius: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Delivery Fee</label>
            <input
              type="number"
              step="0.01"
              className={styles.input}
              value={restaurantSettings.deliveryFee}
              onChange={(e) =>
                setRestaurantSettings({
                  ...restaurantSettings,
                  deliveryFee: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Min Order Amount</label>
            <input
              type="number"
              step="0.01"
              className={styles.input}
              value={restaurantSettings.minOrderAmount}
              onChange={(e) =>
                setRestaurantSettings({
                  ...restaurantSettings,
                  minOrderAmount: parseFloat(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              className={styles.input}
              value={restaurantSettings.taxRate}
              onChange={(e) =>
                setRestaurantSettings({
                  ...restaurantSettings,
                  taxRate: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
      </div>

      <div className={styles.configSection}>
        <h3 className={styles.subsectionTitle}>Business Hours</h3>
        <div className={styles.businessHoursGrid}>
          {Object.entries(restaurantSettings.businessHours).map(
            ([day, hours]) => (
              <div key={day} className={styles.businessHourItem}>
                <div className={styles.dayLabel}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </div>
                <div className={styles.hourControls}>
                  <label className={styles.closedToggle}>
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) =>
                        setRestaurantSettings({
                          ...restaurantSettings,
                          businessHours: {
                            ...restaurantSettings.businessHours,
                            [day]: { ...hours, closed: e.target.checked },
                          },
                        })
                      }
                    />
                    Closed
                  </label>
                  {!hours.closed && (
                    <>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={hours.open}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            businessHours: {
                              ...restaurantSettings.businessHours,
                              [day]: { ...hours, open: e.target.value },
                            },
                          })
                        }
                      />
                      <span>to</span>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={hours.close}
                        onChange={(e) =>
                          setRestaurantSettings({
                            ...restaurantSettings,
                            businessHours: {
                              ...restaurantSettings.businessHours,
                              [day]: { ...hours, close: e.target.value },
                            },
                          })
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <button
        className={styles.saveButton}
        onClick={() => handleSave("Restaurant Settings")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Restaurant Settings"}
      </button>
    </div>
  );

  const renderSecurity = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Security Settings</h2>

      <div className={styles.securitySection}>
        <h3 className={styles.subsectionTitle}>Password Management</h3>
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
        <h3 className={styles.subsectionTitle}>Access Control</h3>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              Admin Session Timeout (minutes)
            </label>
            <input
              type="number"
              className={styles.input}
              value={security.adminSessionTimeout}
              onChange={(e) =>
                setSecurity({
                  ...security,
                  adminSessionTimeout: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Max Login Attempts</label>
            <input
              type="number"
              className={styles.input}
              value={security.loginAttempts}
              onChange={(e) =>
                setSecurity({
                  ...security,
                  loginAttempts: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Lockout Duration (minutes)</label>
            <input
              type="number"
              className={styles.input}
              value={security.lockoutDuration}
              onChange={(e) =>
                setSecurity({
                  ...security,
                  lockoutDuration: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>
              IP Whitelist (comma separated)
            </label>
            <textarea
              className={styles.textarea}
              rows={3}
              value={security.ipWhitelist}
              onChange={(e) =>
                setSecurity({ ...security, ipWhitelist: e.target.value })
              }
              placeholder="192.168.1.1, 10.0.0.1, ..."
            />
          </div>
        </div>
      </div>

      <div className={styles.securitySection}>
        <h3 className={styles.subsectionTitle}>Two-Factor Authentication</h3>
        <div className={styles.toggleItem}>
          <div className={styles.toggleInfo}>
            <label className={styles.toggleLabel}>Enable Admin 2FA</label>
            <span className={styles.toggleDescription}>
              Require two-factor authentication for admin accounts
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

      <button
        className={styles.saveButton}
        onClick={() => handleSave("Security")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Security Settings"}
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className={styles.settingsSection}>
      <h2 className={styles.sectionTitle}>Admin Notifications</h2>
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
        onClick={() => handleSave("Notifications")}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Notification Settings"}
      </button>
    </div>
  );

  const getSystemConfigDescription = (key) => {
    const descriptions = {
      siteMaintenance: "Put the site in maintenance mode",
      newUserRegistration: "Allow new users to register",
      emailNotifications: "Enable system email notifications",
      autoBackup: "Automatically backup system data",
      debugMode: "Enable debug mode for troubleshooting",
    };
    return descriptions[key] || "";
  };

  const getUserManagementDescription = (key) => {
    const descriptions = {
      autoApproveUsers: "Automatically approve new user accounts",
      requireEmailVerification: "Require email verification for new accounts",
      allowGuestOrders: "Allow orders without creating an account",
    };
    return descriptions[key] || "";
  };

  const getNotificationDescription = (key) => {
    const descriptions = {
      newOrderAlert: "Notify when new orders are placed",
      lowStockAlert: "Alert when inventory is running low",
      systemErrorAlert: "Immediate alerts for system errors",
      dailyReports: "Daily business summary reports",
      weeklyReports: "Weekly performance reports",
      monthlyReports: "Monthly analytics reports",
      emergencyAlerts: "Critical system alerts",
      maintenanceNotifications: "Scheduled maintenance reminders",
    };
    return descriptions[key] || "";
  };

  if (isLoading && activeTab === "profile" && !profileData.firstName) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loader}></div>
          <p>Loading admin settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Settings</h1>
        <p className={styles.subtitle}>
          Manage system configuration and administrative preferences
        </p>
        <div className={styles.adminBadge}>
          <span className={styles.crownIcon}>👑</span>
          Administrator Dashboard
        </div>
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
              { id: "profile", label: "Admin Profile", icon: "👑" },
              { id: "system", label: "System Config", icon: "⚙️" },
              { id: "users", label: "User Management", icon: "👥" },
              { id: "restaurant", label: "Restaurant", icon: "🍽️" },
              { id: "security", label: "Security", icon: "🛡️" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
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
          {activeTab === "system" && renderSystemConfig()}
          {activeTab === "users" && renderUserManagement()}
          {activeTab === "restaurant" && renderRestaurantSettings()}
          {activeTab === "security" && renderSecurity()}
          {activeTab === "notifications" && renderNotifications()}
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
