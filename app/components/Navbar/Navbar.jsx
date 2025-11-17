"use client";
import { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import NavLink from "./NavLink";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import { useCart } from "@/app/shared/Context/CartContext";

const Navbar = () => {
  const authCtx = useContext(AuthContext);
  const { getCartItemsCount } = useCart();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);

  const cartCount = getCartItemsCount();

  const getLogoDestination = () => {
    if (!authCtx.isLoggedIn) return "/";
    if (authCtx.role === "admin") return "/admin";
    if (authCtx.role === "user") return "/users";
    return "/";
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const searchToggle = document.querySelector(`.${styles.searchToggle}`);
        if (searchToggle && !searchToggle.contains(event.target)) {
          setIsSearchExpanded(false);
        }
      }

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

  if (authCtx.isLoading) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <Link href="/" className={styles.navbarLogo}>
            <span className={styles.logoIcon}>🍔</span>
            LinuBayo Food
          </Link>
          <div className={styles.navbarLoading}>
            <div className={styles.loadingSkeleton}></div>
          </div>
        </div>
      </nav>
    );
  }

  // Minimal navbar for non-authenticated users
  if (!authCtx.isLoggedIn) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <Link href="/" className={styles.navbarLogo}>
            <span className={styles.logoIcon}>🍔</span>
            LinuBayo Food
          </Link>

          <div className={styles.navbarActions}>
            <Link href="/auth?mode=signup" className={styles.navbarButton}>
              <span className={styles.buttonIcon}>✨</span>
              <span className={styles.buttonText}>Sign Up</span>
            </Link>
            <Link
              href="/auth?mode=login"
              className={`${styles.navbarButton} ${styles.loginButton}`}
            >
              <span className={styles.buttonIcon}>🔑</span>
              <span className={styles.buttonText}>Login</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Full navbar for authenticated users
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <Link href={getLogoDestination()} className={styles.navbarLogo}>
            <span className={styles.logoIcon}>🍔</span>
            LinuBayo Food
          </Link>

          <button
            className={`${styles.mobileMenuToggle} ${
              isMobileMenuOpen ? styles.active : ""
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul
            className={`${styles.navbarMenu} ${
              isMobileMenuOpen ? styles.mobileActive : ""
            }`}
          >
            <li className={styles.navbarItem}>
              {authCtx.role === "admin" ? (
                <NavLink
                  href="/admin"
                  className={styles.navbarLink}
                  onClick={closeMobileMenu}
                  isHomeLink={true}
                >
                  Admin Home
                </NavLink>
              ) : (
                <NavLink
                  href="/users"
                  className={styles.navbarLink}
                  onClick={closeMobileMenu}
                  isHomeLink={true}
                >
                  Home
                </NavLink>
              )}
            </li>

            <li className={styles.navbarItem}>
              <NavLink
                href="/menu"
                className={styles.navbarLink}
                onClick={closeMobileMenu}
              >
                Menu
              </NavLink>
            </li>

            <li className={styles.navbarItem}>
              <NavLink
                href="/contact"
                className={styles.navbarLink}
                onClick={closeMobileMenu}
              >
                Contact
              </NavLink>
            </li>

            <li className={styles.navbarItem}>
              <NavLink
                href="/sessions"
                className={styles.navbarLink}
                onClick={closeMobileMenu}
              >
                Live Sessions
              </NavLink>
            </li>

            {authCtx.role === "user" && (
              <li className={styles.navbarItem}>
                <NavLink
                  href="/orders"
                  className={styles.navbarLink}
                  onClick={closeMobileMenu}
                >
                  My Orders
                </NavLink>
              </li>
            )}

            {authCtx.role === "admin" && (
              <li className={styles.navbarItem}>
                <NavLink
                  href="/admin/users"
                  className={styles.navbarLink}
                  onClick={closeMobileMenu}
                >
                  Users
                </NavLink>
              </li>
            )}

            <li className={styles.navbarItem}>
              <NavLink
                href="/users/reservation"
                className={styles.navbarLink}
                onClick={closeMobileMenu}
              >
                {authCtx.role === "admin"
                  ? "All Reservations"
                  : "My Reservations"}
              </NavLink>
            </li>
          </ul>

          <div className={styles.navbarActions}>
            <button
              className={styles.searchToggle}
              onClick={handleSearchToggle}
              aria-label={
                isSearchExpanded ? "Collapse search" : "Expand search"
              }
            >
              <span className={styles.searchIcon}>🔍</span>
            </button>

            <div className={styles.userActions}>
              {authCtx.role === "user" && (
                <Link
                  href="/cart"
                  className={`${styles.navbarButton} ${styles.cartButton}`}
                >
                  <span className={styles.cartIcon}>🛒</span>
                  {cartCount > 0 && (
                    <span className={styles.cartCount}>
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              <div className={styles.userMenuContainer} ref={userDropdownRef}>
                <button
                  className={`${styles.navbarButton} ${styles.userMenuToggle}`}
                  onClick={toggleUserDropdown}
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <span className={styles.profileIcon}>
                    {authCtx.role === "admin" ? "👑" : "👤"}
                  </span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>

                {isUserDropdownOpen && (
                  <div className={styles.userDropdown}>
                    <div className={styles.userDropdownHeader}>
                      <span className={styles.userRole}>
                        {authCtx.role === "admin" ? "Admin" : "User"}
                      </span>
                      {authCtx.userId && (
                        <span className={styles.userId}>
                          ID: {authCtx.userId}
                        </span>
                      )}
                      {authCtx.role === "user" && cartCount > 0 && (
                        <span className={styles.cartSummary}>
                          Cart: {cartCount} items
                        </span>
                      )}
                    </div>

                    <Link
                      href={
                        authCtx.role === "admin" ? "/admin/profile" : "/profile"
                      }
                      className={styles.userDropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <span className={styles.dropdownIcon}>👤</span>
                      Profile
                    </Link>

                    {authCtx.role === "user" && (
                      <Link
                        href="/cart"
                        className={styles.userDropdownItem}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <span className={styles.dropdownIcon}>🛒</span>
                        Cart {cartCount > 0 && `(${cartCount})`}
                      </Link>
                    )}

                    <Link
                      href="/notifications"
                      className={styles.userDropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <span className={styles.dropdownIcon}>🔔</span>
                      Notifications
                    </Link>

                    <Link
                      href={
                        authCtx.role === "admin"
                          ? "/admin/settings"
                          : "/settings"
                      }
                      className={styles.userDropdownItem}
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <span className={styles.dropdownIcon}>⚙️</span>
                      Settings
                    </Link>

                    <div className={styles.dropdownDivider}></div>

                    <button
                      onClick={handleLogout}
                      className={`${styles.userDropdownItem} ${styles.logoutItem}`}
                    >
                      <span className={styles.dropdownIcon}>🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.searchExpandedContainer} ${
          isSearchExpanded ? styles.active : ""
        }`}
        ref={searchRef}
      >
        <div className={styles.searchExpandedContent}>
          <form
            onSubmit={handleSearchSubmit}
            className={styles.searchExpandedForm}
          >
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIconLarge}>🔍</span>
              <input
                type="text"
                className={styles.searchExpandedInput}
                placeholder="Search for delicious food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          <div className={styles.quickLinks}>
            <h3>Quick Links</h3>
            <div className={styles.quickLinksGrid}>
              <Link href="/favorites" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>❤️</span>
                <span className={styles.quickLinkText}>Favorites</span>
              </Link>
              <Link href="/order-history" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>📋</span>
                <span className={styles.quickLinkText}>Order History</span>
              </Link>
              <Link href="/stores" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>📍</span>
                <span className={styles.quickLinkText}>Find a Store</span>
              </Link>
              <Link href="/deals" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>🎯</span>
                <span className={styles.quickLinkText}>Today's Deals</span>
              </Link>
              <Link href="/meal-plans" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>🎒</span>
                <span className={styles.quickLinkText}>Meal Plans</span>
              </Link>
              <Link href="/nutrition" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>🥗</span>
                <span className={styles.quickLinkText}>Nutrition Info</span>
              </Link>
              <Link href="/rewards" className={styles.quickLinkItem}>
                <span className={styles.quickLinkIcon}>🎁</span>
                <span className={styles.quickLinkText}>Rewards Program</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
};

export default Navbar;
