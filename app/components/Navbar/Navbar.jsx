"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";
import NavLink from "./NavLink";

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should come from your auth context/state
  const [cartCount, setCartCount] = useState(3); // This should come from your cart state
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Simulate auth check - replace with your actual auth logic
  useEffect(() => {
    // Check if user is logged in (from localStorage, context, etc.)
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };

    checkAuth();
  }, []);

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

  const handleLogin = () => {
    // Implement your login logic here
    console.log("Redirecting to login...");
    // window.location.href = '/login';
  };

  const handleLogout = () => {
    // Implement your logout logic here
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    console.log("User logged out");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Handle click outside for search and user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle search dropdown
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const searchToggle = document.querySelector(".search-toggle");
        if (searchToggle && !searchToggle.contains(event.target)) {
          setIsSearchExpanded(false);
        }
      }

      // Handle user menu dropdown
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-logo">
            <span className="logo-icon">🍔</span>
            LinuBayo Food
          </Link>

          <ul className="navbar-menu">
            <li className="navbar-item">
              <NavLink href="/" className="navbar-link">
                Home
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink href="/menu" className="navbar-link">
                Menu
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink href="/about" className="navbar-link">
                About
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink href="/contact" className="navbar-link">
                Contact
              </NavLink>
            </li>
            {isLoggedIn && (
              <li className="navbar-item">
                <NavLink href="/orders" className="navbar-link">
                  My Orders
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

            {/* Cart Button - Only show if logged in */}
            {isLoggedIn && (
              <Link href="/cart" className="navbar-button cart-button">
                <span className="cart-icon">🛒</span>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </Link>
            )}

            {/* User Authentication Section */}
            {isLoggedIn ? (
              <div className="user-menu-container" ref={userMenuRef}>
                <button
                  className="navbar-button account-button"
                  onClick={toggleUserMenu}
                >
                  <span className="account-icon">👤</span>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link href="/profile" className="user-dropdown-item">
                      <span className="dropdown-icon">👤</span>
                      Profile
                    </Link>
                    <Link href="/orders" className="user-dropdown-item">
                      <span className="dropdown-icon">📋</span>
                      My Orders
                    </Link>
                    <Link href="/favorites" className="user-dropdown-item">
                      <span className="dropdown-icon">❤️</span>
                      Favorites
                    </Link>
                    <Link href="/settings" className="user-dropdown-item">
                      <span className="dropdown-icon">⚙️</span>
                      Settings
                    </Link>
                    <hr className="dropdown-divider" />
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
            ) : (
              <div className="auth-buttons">
                <Link href="/login" className="navbar-button login-button">
                  <span className="login-icon">🔑</span>
                  Login
                </Link>
                {/* <Link
                  href="/register"
                  className="navbar-button register-button"
                >
                  <span className="register-icon">📝</span>
                  Sign Up
                </Link> */}
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
              <Link href="/stores" className="quick-link-item">
                <span className="quick-link-icon">📍</span>
                <span className="quick-link-text">Find a Store</span>
              </Link>
              <Link href="/deals" className="quick-link-item">
                <span className="quick-link-icon">🎯</span>
                <span className="quick-link-text">Today's Deals</span>
              </Link>
              <Link href="/meal-plans" className="quick-link-item">
                <span className="quick-link-icon">🎒</span>
                <span className="quick-link-text">Meal Plans</span>
              </Link>
              <Link href="/nutrition" className="quick-link-item">
                <span className="quick-link-icon">🥗</span>
                <span className="quick-link-text">Nutrition Info</span>
              </Link>
              <Link href="/rewards" className="quick-link-item">
                <span className="quick-link-icon">🎁</span>
                <span className="quick-link-text">Rewards Program</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
