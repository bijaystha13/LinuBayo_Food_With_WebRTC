"use client";
import { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import "./Navbar.css";
import NavLink from "./NavLink";
import { AuthContext } from "@/app/shared/Context/AuthContext";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Debug: Log auth context values
  useEffect(() => {
    console.log("Auth state updated:", {
      isLoggedIn: authCtx.isLoggedIn,
      isLoading: authCtx.isLoading,
      userId: authCtx.userId,
      role: authCtx.role,
    });
  }, [authCtx.isLoggedIn, authCtx.isLoading, authCtx.userId, authCtx.role]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Direct localStorage check:", {
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId"),
        role: localStorage.getItem("role"),
      });
    }
  }, [authCtx.isLoggedIn]);

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }, 100);
    } else if (searchQuery) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setIsSearchExpanded(false);
    }
  };

  const handleLogout = () => {
    authCtx.logout();
    setIsUserDropdownOpen(false);
    console.log("User logged out");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle click outside for search and user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle search dropdown
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const searchToggle = document.querySelector(".search-toggle");
        if (searchToggle && !searchToggle.contains(event.target)) {
          setIsSearchExpanded(false);
        }
      }

      // Handle user dropdown
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show loading state while auth is being checked
  if (authCtx.isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🍔</span>
            LinuBayo Food
          </Link>
          <div className="navbar-loading">
            <div className="loading-skeleton"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🍔</span>
            LinuBayo Food
          </Link>

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul
            className={`navbar-menu ${isMobileMenuOpen ? "mobile-active" : ""}`}
          >
            {/* Home - Always visible */}
            <li className="navbar-item">
              <NavLink
                href="/"
                className="navbar-link"
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>

            {/* Menu - Always visible */}
            <li className="navbar-item">
              <NavLink
                href="/menu"
                className="navbar-link"
                onClick={closeMobileMenu}
              >
                Menu
              </NavLink>
            </li>

            {/* About - Only visible when NOT logged in */}
            {!authCtx.isLoggedIn && (
              <li className="navbar-item">
                <NavLink
                  href="/about"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  About
                </NavLink>
              </li>
            )}

            {/* Contact - Always visible */}
            <li className="navbar-item">
              <NavLink
                href="/contact"
                className="navbar-link"
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>
            </li>

            {/* Live Sessions - Only for logged in users */}
            {authCtx.isLoggedIn && (
              <li className="navbar-item">
                <NavLink
                  href="/sessions"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  Live Sessions
                </NavLink>
              </li>
            )}

            {/* My Orders - Only for logged in regular users */}
            {authCtx.isLoggedIn && authCtx.role === "user" && (
              <li className="navbar-item">
                <NavLink
                  href="/orders"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  My Orders
                </NavLink>
              </li>
            )}

            {/* Admin Panel - Only for admin users */}
            {authCtx.isLoggedIn && authCtx.role === "admin" && (
              <li className="navbar-item">
                <NavLink
                  href="/admin"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  Admin Panel
                </NavLink>
              </li>
            )}

            {/* Dashboard - Only for admin users */}
            {authCtx.isLoggedIn && authCtx.role === "admin" && (
              <li className="navbar-item">
                <NavLink
                  href="/admin/dashboard"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {/* User Management - Only for admin users */}
            {authCtx.isLoggedIn && authCtx.role === "admin" && (
              <li className="navbar-item">
                <NavLink
                  href="/admin/users"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  Users
                </NavLink>
              </li>
            )}

            {/* Reservations - Only for logged in users */}
            {authCtx.isLoggedIn && (
              <li className="navbar-item">
                <NavLink
                  href="/reservations"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  {authCtx.role === "admin"
                    ? "All Reservations"
                    : "My Reservations"}
                </NavLink>
              </li>
            )}
          </ul>

          <div className="navbar-actions">
            <button
              className="search-toggle"
              onClick={handleSearchToggle}
              aria-label={
                isSearchExpanded ? "Collapse search" : "Expand search"
              }
            >
              <span className="search-icon">🔍</span>
            </button>

            {/* Auth Section */}
            {!authCtx.isLoggedIn ? (
              <div className="auth-buttons">
                {/* Sign Up link for non-authenticated users */}
                <Link href="/auth" className="navbar-button signup-button">
                  <span className="signup-icon">📝</span>
                  <span className="button-text">Sign Up</span>
                </Link>
                <Link href="/auth" className="navbar-button login-button">
                  <span className="login-icon">🔑</span>
                  <span className="button-text">Login</span>
                </Link>
              </div>
            ) : (
              <div className="user-actions">
                {/* Cart Button - Only show for regular users */}
                {authCtx.role === "user" && (
                  <Link href="/cart" className="navbar-button cart-button">
                    <span className="cart-icon">🛒</span>
                    {cartCount > 0 && (
                      <span className="cart-count">{cartCount}</span>
                    )}
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="user-menu-container" ref={userDropdownRef}>
                  <button
                    className="navbar-button user-menu-toggle"
                    onClick={toggleUserDropdown}
                    aria-label="User menu"
                    aria-expanded={isUserDropdownOpen}
                  >
                    <span className="profile-icon">
                      {authCtx.role === "admin" ? "👑" : "👤"}
                    </span>
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <span className="user-role">
                          {authCtx.role === "admin" ? "Admin" : "User"}
                        </span>
                        {authCtx.userId && (
                          <span className="user-id">ID: {authCtx.userId}</span>
                        )}
                      </div>

                      <Link
                        href={
                          authCtx.role === "admin"
                            ? "/admin/profile"
                            : "/profile"
                        }
                        className="user-dropdown-item"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">👤</span>
                        Profile
                      </Link>

                      <Link
                        href="/notifications"
                        className="user-dropdown-item"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">🔔</span>
                        Notifications
                      </Link>

                      <Link
                        href={
                          authCtx.role === "admin"
                            ? "/admin/settings"
                            : "/settings"
                        }
                        className="user-dropdown-item"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <span className="dropdown-icon">⚙️</span>
                        Settings
                      </Link>

                      <div className="dropdown-divider"></div>

                      <button
                        onClick={handleLogout}
                        className="user-dropdown-item logout-item"
                      >
                        <span className="dropdown-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Expanded Container */}
      <div
        className={`search-expanded-container ${
          isSearchExpanded ? "active" : ""
        }`}
        ref={searchRef}
      >
        <div className="search-expanded-content">
          <form onSubmit={handleSearchSubmit} className="search-expanded-form">
            <div className="search-input-wrapper">
              <span className="search-icon-large">🔍</span>
              <input
                type="text"
                className="search-expanded-input"
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          <div className="quick-links">
            <h3>Quick Links</h3>
            <div className="quick-links-grid">
              {/* Dynamic quick links based on auth status */}
              {!authCtx.isLoggedIn ? (
                <>
                  <Link href="/about" className="quick-link-item">
                    <span className="quick-link-icon">ℹ️</span>
                    <span className="quick-link-text">About Us</span>
                  </Link>
                  <Link href="/menu" className="quick-link-item">
                    <span className="quick-link-icon">🍽️</span>
                    <span className="quick-link-text">Our Menu</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/favorites" className="quick-link-item">
                    <span className="quick-link-icon">❤️</span>
                    <span className="quick-link-text">Favorites</span>
                  </Link>
                  <Link href="/order-history" className="quick-link-item">
                    <span className="quick-link-icon">📋</span>
                    <span className="quick-link-text">Order History</span>
                  </Link>
                </>
              )}

              <Link href="/stores" className="quick-link-item">
                <span className="quick-link-icon">📍</span>
                <span className="quick-link-text">Find a Store</span>
              </Link>

              <Link href="/deals" className="quick-link-item">
                <span className="quick-link-icon">🎯</span>
                <span className="quick-link-text">Today's Deals</span>
              </Link>

              {authCtx.isLoggedIn && (
                <Link href="/meal-plans" className="quick-link-item">
                  <span className="quick-link-icon">🎒</span>
                  <span className="quick-link-text">Meal Plans</span>
                </Link>
              )}

              <Link href="/nutrition" className="quick-link-item">
                <span className="quick-link-icon">🥗</span>
                <span className="quick-link-text">Nutrition Info</span>
              </Link>

              {authCtx.isLoggedIn && (
                <Link href="/rewards" className="quick-link-item">
                  <span className="quick-link-icon">🎁</span>
                  <span className="quick-link-text">Rewards Program</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
    </>
  );
};

export default Navbar;
