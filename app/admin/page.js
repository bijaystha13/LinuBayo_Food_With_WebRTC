"use client";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import Link from "next/link";
import styles from "./adminhome.module.css";

const AdminHomePage = () => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      todayOrders: 0,
      activeUsers: 0,
      pendingOrders: 0,
    },
    recentOrders: [],
    recentUsers: [],
    systemHealth: {
      serverStatus: "online",
      databaseStatus: "online",
      lastBackup: "",
      uptime: "",
    },
    notifications: [],
    quickActions: [],
  });

  const [timeRange, setTimeRange] = useState("today");
  const [chartData, setChartData] = useState({
    labels: [],
    revenue: [],
    orders: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock data based on time range
      const mockStats = {
        today: {
          totalOrders: 156,
          totalUsers: 2847,
          totalRevenue: 12450.75,
          todayOrders: 23,
          activeUsers: 142,
          pendingOrders: 8,
        },
        week: {
          totalOrders: 1284,
          totalUsers: 2847,
          totalRevenue: 89650.25,
          todayOrders: 23,
          activeUsers: 142,
          pendingOrders: 8,
        },
        month: {
          totalOrders: 5672,
          totalUsers: 2847,
          totalRevenue: 385420.8,
          todayOrders: 23,
          activeUsers: 142,
          pendingOrders: 8,
        },
      };

      setDashboardData({
        stats: mockStats[timeRange],
        recentOrders: [
          {
            id: "#ORD-001",
            customer: "John Smith",
            amount: 45.99,
            status: "completed",
            time: "2 min ago",
          },
          {
            id: "#ORD-002",
            customer: "Sarah Johnson",
            amount: 32.5,
            status: "pending",
            time: "5 min ago",
          },
          {
            id: "#ORD-003",
            customer: "Mike Wilson",
            amount: 78.25,
            status: "preparing",
            time: "8 min ago",
          },
          {
            id: "#ORD-004",
            customer: "Emma Davis",
            amount: 21.75,
            status: "completed",
            time: "12 min ago",
          },
          {
            id: "#ORD-005",
            customer: "Robert Brown",
            amount: 65.0,
            status: "delivery",
            time: "15 min ago",
          },
        ],
        recentUsers: [
          {
            name: "Alex Turner",
            email: "alex@email.com",
            joined: "1 hour ago",
            status: "active",
          },
          {
            name: "Lisa Chen",
            email: "lisa@email.com",
            joined: "2 hours ago",
            status: "pending",
          },
          {
            name: "Mark Johnson",
            email: "mark@email.com",
            joined: "3 hours ago",
            status: "active",
          },
          {
            name: "Sophie Wilson",
            email: "sophie@email.com",
            joined: "4 hours ago",
            status: "active",
          },
        ],
        systemHealth: {
          serverStatus: "online",
          databaseStatus: "online",
          lastBackup: "2 hours ago",
          uptime: "99.8%",
        },
        notifications: [
          {
            type: "warning",
            message: "Low stock alert: Chicken Burger (5 remaining)",
            time: "10 min ago",
          },
          {
            type: "info",
            message: "Daily backup completed successfully",
            time: "2 hours ago",
          },
          {
            type: "success",
            message: "New user registration: 15 today",
            time: "3 hours ago",
          },
          {
            type: "error",
            message: "Failed payment attempt detected",
            time: "5 hours ago",
          },
        ],
        quickActions: [
          {
            title: "Add New Menu Item",
            icon: "🍽️",
            link: "/admin/menu/add",
            color: "primary",
          },
          {
            title: "Manage Users",
            icon: "👥",
            link: "/admin/users",
            color: "secondary",
          },
          {
            title: "View Reports",
            icon: "📊",
            link: "/admin/reports",
            color: "info",
          },
          {
            title: "System Settings",
            icon: "⚙️",
            link: "/admin/settings",
            color: "warning",
          },
        ],
      });

      // Mock chart data
      const chartMockData = {
        today: {
          labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
          revenue: [250, 450, 1200, 800, 1500, 650],
          orders: [5, 12, 28, 18, 35, 15],
        },
        week: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          revenue: [2400, 3200, 2800, 4100, 5200, 6800, 4500],
          orders: [45, 65, 55, 82, 95, 128, 85],
        },
        month: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          revenue: [18500, 22300, 19800, 24850],
          orders: [385, 445, 398, 485],
        },
      };

      setChartData(chartMockData[timeRange]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: styles.statusCompleted,
      pending: styles.statusPending,
      preparing: styles.statusPreparing,
      delivery: styles.statusDelivery,
      active: styles.statusActive,
      online: styles.statusOnline,
      offline: styles.statusOffline,
    };
    return colors[status] || styles.statusDefault;
  };

  const getNotificationIcon = (type) => {
    const icons = {
      warning: "⚠️",
      info: "ℹ️",
      success: "✅",
      error: "❌",
    };
    return icons[type] || "📢";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("en-US").format(number);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loader}></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.title}>
            <span className={styles.crownIcon}>👑</span>
            Welcome back, Admin
          </h1>
          <p className={styles.subtitle}>
            Here&apos;s what&apos;s happening with your restaurant today
          </p>
        </div>

        <div className={styles.timeRangeSelector}>
          <button
            className={`${styles.timeButton} ${
              timeRange === "today" ? styles.active : ""
            }`}
            onClick={() => setTimeRange("today")}
          >
            Today
          </button>
          <button
            className={`${styles.timeButton} ${
              timeRange === "week" ? styles.active : ""
            }`}
            onClick={() => setTimeRange("week")}
          >
            This Week
          </button>
          <button
            className={`${styles.timeButton} ${
              timeRange === "month" ? styles.active : ""
            }`}
            onClick={() => setTimeRange("month")}
          >
            This Month
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Total Revenue</h3>
            <p className={styles.statValue}>
              {formatCurrency(dashboardData.stats.totalRevenue)}
            </p>
            <span className={styles.statChange}>
              +12.5% from last {timeRange}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Total Orders</h3>
            <p className={styles.statValue}>
              {formatNumber(dashboardData.stats.totalOrders)}
            </p>
            <span className={styles.statChange}>
              +8.3% from last {timeRange}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Total Users</h3>
            <p className={styles.statValue}>
              {formatNumber(dashboardData.stats.totalUsers)}
            </p>
            <span className={styles.statChange}>
              +15.2% from last {timeRange}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <h3 className={styles.statTitle}>Pending Orders</h3>
            <p className={styles.statValue}>
              {dashboardData.stats.pendingOrders}
            </p>
            <span className={styles.statChange}>Needs attention</span>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        {/* Chart Section */}
        <section className={styles.chartSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Revenue & Orders Overview</h2>
            <select
              className={styles.chartSelector}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.chartPlaceholder}>
              <div className={styles.chartBars}>
                {chartData.revenue.map((value, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div
                      className={styles.revenueBar}
                      style={{
                        height: `${
                          (value / Math.max(...chartData.revenue)) * 100
                        }%`,
                      }}
                    ></div>
                    <div
                      className={styles.ordersBar}
                      style={{
                        height: `${
                          (chartData.orders[index] /
                            Math.max(...chartData.orders)) *
                          100
                        }%`,
                      }}
                    ></div>
                    <span className={styles.chartLabel}>
                      {chartData.labels[index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: "#ff6b35" }}
                  ></div>
                  Revenue
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendColor}
                    style={{ backgroundColor: "#ffa500" }}
                  ></div>
                  Orders
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Orders</h3>
            <Link href="/admin/orders" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          <div className={styles.ordersList}>
            {dashboardData.recentOrders.map((order, index) => (
              <div key={index} className={styles.orderItem}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>{order.id}</span>
                  <span className={styles.customerName}>{order.customer}</span>
                  <span className={styles.orderTime}>{order.time}</span>
                </div>
                <div className={styles.orderMeta}>
                  <span className={styles.orderAmount}>
                    {formatCurrency(order.amount)}
                  </span>
                  <span
                    className={`${styles.orderStatus} ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h3 className={styles.sectionTitle}>Quick Actions</h3>
          <div className={styles.actionsGrid}>
            {dashboardData.quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className={`${styles.actionCard} ${styles[action.color]}`}
              >
                <div className={styles.actionIcon}>{action.icon}</div>
                <span className={styles.actionTitle}>{action.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Users */}
        <section className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Users</h3>
            <Link href="/admin/users" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          <div className={styles.usersList}>
            {dashboardData.recentUsers.map((user, index) => (
              <div key={index} className={styles.userItem}>
                <div className={styles.userAvatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                  <span className={styles.userJoined}>{user.joined}</span>
                </div>
                <span
                  className={`${styles.userStatus} ${getStatusColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* System Health */}
        <section className={styles.systemHealth}>
          <h3 className={styles.sectionTitle}>System Health</h3>
          <div className={styles.healthGrid}>
            <div className={styles.healthItem}>
              <span className={styles.healthLabel}>Server Status</span>
              <span
                className={`${styles.healthStatus} ${getStatusColor(
                  dashboardData.systemHealth.serverStatus
                )}`}
              >
                {dashboardData.systemHealth.serverStatus}
              </span>
            </div>
            <div className={styles.healthItem}>
              <span className={styles.healthLabel}>Database</span>
              <span
                className={`${styles.healthStatus} ${getStatusColor(
                  dashboardData.systemHealth.databaseStatus
                )}`}
              >
                {dashboardData.systemHealth.databaseStatus}
              </span>
            </div>
            <div className={styles.healthItem}>
              <span className={styles.healthLabel}>Last Backup</span>
              <span className={styles.healthValue}>
                {dashboardData.systemHealth.lastBackup}
              </span>
            </div>
            <div className={styles.healthItem}>
              <span className={styles.healthLabel}>Uptime</span>
              <span className={styles.healthValue}>
                {dashboardData.systemHealth.uptime}
              </span>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className={styles.notifications}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Notifications</h3>
            <Link href="/admin/notifications" className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          <div className={styles.notificationsList}>
            {dashboardData.notifications.map((notification, index) => (
              <div
                key={index}
                className={`${styles.notificationItem} ${
                  styles[notification.type]
                }`}
              >
                <span className={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </span>
                <div className={styles.notificationContent}>
                  <p className={styles.notificationMessage}>
                    {notification.message}
                  </p>
                  <span className={styles.notificationTime}>
                    {notification.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminHomePage;
