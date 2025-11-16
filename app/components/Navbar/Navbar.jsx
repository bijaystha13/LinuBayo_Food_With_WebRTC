// "use client";
// import { useState, useRef, useEffect, useContext } from "react";
// import Link from "next/link";
// import "./Navbar.css";
// import NavLink from "./NavLink";
// import { AuthContext } from "@/app/shared/Context/AuthContext";
// import { useCart } from "@/app/shared/Context/CartContext"; // Add cart context

// const Navbar = () => {
//   const authCtx = useContext(AuthContext);
//   const { getCartItemsCount } = useCart(); // Get cart items count
//   const [isSearchExpanded, setIsSearchExpanded] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
//   const searchRef = useRef(null);
//   const userDropdownRef = useRef(null);

//   // Get dynamic cart count from context
//   const cartCount = getCartItemsCount();

//   // Debug: Log auth context values
//   useEffect(() => {
//     console.log("Auth state updated:", {
//       isLoggedIn: authCtx.isLoggedIn,
//       isLoading: authCtx.isLoading,
//       userId: authCtx.userId,
//       role: authCtx.role,
//     });
//   }, [authCtx.isLoggedIn, authCtx.isLoading, authCtx.userId, authCtx.role]);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       console.log("Direct localStorage check:", {
//         token: localStorage.getItem("token"),
//         userId: localStorage.getItem("userId"),
//         role: localStorage.getItem("role"),
//       });
//     }
//   }, [authCtx.isLoggedIn]);

//   // Debug: Log cart count changes
//   useEffect(() => {
//     console.log("Cart items count updated:", cartCount);
//   }, [cartCount]);

//   // Function to get the logo destination URL
//   const getLogoDestination = () => {
//     if (!authCtx.isLoggedIn) {
//       return "/"; // Public home page for non-logged in users
//     }

//     if (authCtx.role === "admin") {
//       return "/admin"; // Admin home page
//     }

//     if (authCtx.role === "user") {
//       return "/users"; // User home page
//     }

//     return "/"; // Fallback to public home
//   };

//   const handleSearchToggle = () => {
//     setIsSearchExpanded(!isSearchExpanded);
//     if (!isSearchExpanded) {
//       setTimeout(() => {
//         if (searchRef.current) {
//           searchRef.current.focus();
//         }
//       }, 100);
//     } else if (searchQuery) {
//       console.log("Searching for:", searchQuery);
//       setSearchQuery("");
//     }
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery) {
//       console.log("Searching for:", searchQuery);
//       setSearchQuery("");
//       setIsSearchExpanded(false);
//     }
//   };

//   const handleLogout = () => {
//     authCtx.logout();
//     setIsUserDropdownOpen(false);
//     console.log("User logged out");
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const toggleUserDropdown = () => {
//     setIsUserDropdownOpen(!isUserDropdownOpen);
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//   };

//   // Handle click outside for search and user dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Handle search dropdown
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         const searchToggle = document.querySelector(".search-toggle");
//         if (searchToggle && !searchToggle.contains(event.target)) {
//           setIsSearchExpanded(false);
//         }
//       }

//       // Handle user dropdown
//       if (
//         userDropdownRef.current &&
//         !userDropdownRef.current.contains(event.target)
//       ) {
//         setIsUserDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Show loading state while auth is being checked
//   if (authCtx.isLoading) {
//     return (
//       <nav className="navbar">
//         <div className="navbar-container">
//           <Link href="/" className="navbar-logo">
//             <span className="logo-icon">🍔</span>
//             LinuBayo Food
//           </Link>
//           <div className="navbar-loading">
//             <div className="loading-skeleton"></div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-container">
//           {/* Dynamic Logo Navigation */}
//           <Link href={getLogoDestination()} className="navbar-logo">
//             <span className="logo-icon">🍔</span>
//             LinuBayo Food
//           </Link>

//           {/* Mobile Menu Button */}
//           <button
//             className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
//             onClick={toggleMobileMenu}
//             aria-label="Toggle mobile menu"
//           >
//             <span></span>
//             <span></span>
//             <span></span>
//           </button>

//           <ul
//             className={`navbar-menu ${isMobileMenuOpen ? "mobile-active" : ""}`}
//           >
//             {/* Home - Dynamic based on login status */}
//             <li className="navbar-item">
//               {!authCtx.isLoggedIn && (
//                 <NavLink
//                   href="/"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                   isHomeLink={true}
//                 >
//                   Home
//                 </NavLink>
//               )}
//               {authCtx.isLoggedIn && authCtx.role === "admin" && (
//                 <NavLink
//                   href="/admin"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                   isHomeLink={true}
//                 >
//                   Admin Home
//                 </NavLink>
//               )}
//               {authCtx.isLoggedIn && authCtx.role !== "admin" && (
//                 <NavLink
//                   href="/users"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                   isHomeLink={true}
//                 >
//                   Users Home
//                 </NavLink>
//               )}
//             </li>

//             {/* Menu - Always visible */}
//             <li className="navbar-item">
//               <NavLink
//                 href="/menu"
//                 className="navbar-link"
//                 onClick={closeMobileMenu}
//               >
//                 Menu
//               </NavLink>
//             </li>

//             {/* About - Only visible when NOT logged in */}
//             {!authCtx.isLoggedIn && (
//               <li className="navbar-item">
//                 <NavLink
//                   href="/about"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                 >
//                   About
//                 </NavLink>
//               </li>
//             )}

//             {/* Contact - Always visible */}
//             <li className="navbar-item">
//               <NavLink
//                 href="/contact"
//                 className="navbar-link"
//                 onClick={closeMobileMenu}
//               >
//                 Contact
//               </NavLink>
//             </li>

//             {/* Live Sessions - Only for logged in users */}
//             {authCtx.isLoggedIn && (
//               <li className="navbar-item">
//                 <NavLink
//                   href="/sessions"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                 >
//                   Live Sessions
//                 </NavLink>
//               </li>
//             )}

//             {/* My Orders - Only for logged in regular users */}
//             {authCtx.isLoggedIn && authCtx.role === "user" && (
//               <li className="navbar-item">
//                 <NavLink
//                   href="/orders"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                 >
//                   My Orders
//                 </NavLink>
//               </li>
//             )}

//             {/* User Management - Only for admin users */}
//             {authCtx.isLoggedIn && authCtx.role === "admin" && (
//               <li className="navbar-item">
//                 <NavLink
//                   href="/admin/users"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                 >
//                   Users
//                 </NavLink>
//               </li>
//             )}

//             {/* Reservations - Only for logged in users */}
//             {authCtx.isLoggedIn && (
//               <li className="navbar-item">
//                 <NavLink
//                   href="/users/reservation"
//                   className="navbar-link"
//                   onClick={closeMobileMenu}
//                 >
//                   {authCtx.role === "admin"
//                     ? "All Reservations"
//                     : "My Reservations"}
//                 </NavLink>
//               </li>
//             )}
//           </ul>

//           <div className="navbar-actions">
//             <button
//               className="search-toggle"
//               onClick={handleSearchToggle}
//               aria-label={
//                 isSearchExpanded ? "Collapse search" : "Expand search"
//               }
//             >
//               <span className="search-icon">🔍</span>
//             </button>

//             {/* Auth Section */}
//             {!authCtx.isLoggedIn ? (
//               <div className="auth-buttons">
//                 {/* Sign Up link for non-authenticated users */}

//                 <Link href="/auth" className="navbar-button login-button">
//                   <span className="login-icon">🔑</span>
//                   <span className="button-text">Login</span>
//                 </Link>
//               </div>
//             ) : (
//               <div className="user-actions">
//                 {/* Cart Button - Only show for regular users with dynamic count */}
//                 {authCtx.role === "user" && (
//                   <Link href="/cart" className="navbar-button cart-button">
//                     <span className="cart-icon">🛒</span>
//                     {cartCount > 0 && (
//                       <span
//                         className={`cart-count ${
//                           cartCount > 99 ? "cart-count-large" : ""
//                         }`}
//                         title={`${cartCount} items in cart`}
//                       >
//                         {cartCount > 99 ? "99+" : cartCount}
//                       </span>
//                     )}
//                   </Link>
//                 )}

//                 {/* User Dropdown */}
//                 <div className="user-menu-container" ref={userDropdownRef}>
//                   <button
//                     className="navbar-button user-menu-toggle"
//                     onClick={toggleUserDropdown}
//                     aria-label="User menu"
//                     aria-expanded={isUserDropdownOpen}
//                   >
//                     <span className="profile-icon">
//                       {authCtx.role === "admin" ? "👑" : "👤"}
//                     </span>
//                     <span className="dropdown-arrow">▼</span>
//                   </button>

//                   {isUserDropdownOpen && (
//                     <div className="user-dropdown">
//                       <div className="user-dropdown-header">
//                         <span className="user-role">
//                           {authCtx.role === "admin" ? "Admin" : "User"}
//                         </span>
//                         {authCtx.userId && (
//                           <span className="user-id">ID: {authCtx.userId}</span>
//                         )}
//                         {/* Show cart summary for users */}
//                         {authCtx.role === "user" && cartCount > 0 && (
//                           <span className="cart-summary">
//                             Cart: {cartCount} items
//                           </span>
//                         )}
//                       </div>

//                       <Link
//                         href={
//                           authCtx.role === "admin"
//                             ? "/admin/profile"
//                             : "/profile"
//                         }
//                         className="user-dropdown-item"
//                         onClick={() => setIsUserDropdownOpen(false)}
//                       >
//                         <span className="dropdown-icon">👤</span>
//                         Profile
//                       </Link>

//                       {/* Cart link in dropdown for mobile users */}
//                       {authCtx.role === "user" && (
//                         <Link
//                           href="/cart"
//                           className="user-dropdown-item"
//                           onClick={() => setIsUserDropdownOpen(false)}
//                         >
//                           <span className="dropdown-icon">🛒</span>
//                           Cart {cartCount > 0 && `(${cartCount})`}
//                         </Link>
//                       )}

//                       <Link
//                         href="/notifications"
//                         className="user-dropdown-item"
//                         onClick={() => setIsUserDropdownOpen(false)}
//                       >
//                         <span className="dropdown-icon">🔔</span>
//                         Notifications
//                       </Link>

//                       <Link
//                         href={
//                           authCtx.role === "admin"
//                             ? "/admin/settings"
//                             : "/settings"
//                         }
//                         className="user-dropdown-item"
//                         onClick={() => setIsUserDropdownOpen(false)}
//                       >
//                         <span className="dropdown-icon">⚙️</span>
//                         Settings
//                       </Link>

//                       <div className="dropdown-divider"></div>

//                       <button
//                         onClick={handleLogout}
//                         className="user-dropdown-item logout-item"
//                       >
//                         <span className="dropdown-icon">🚪</span>
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Search Expanded Container */}
//       <div
//         className={`search-expanded-container ${
//           isSearchExpanded ? "active" : ""
//         }`}
//         ref={searchRef}
//       >
//         <div className="search-expanded-content">
//           <form onSubmit={handleSearchSubmit} className="search-expanded-form">
//             <div className="search-input-wrapper">
//               <span className="search-icon-large">🔍</span>
//               <input
//                 type="text"
//                 className="search-expanded-input"
//                 placeholder="Search for delicious food..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   className="clear-search"
//                   onClick={() => setSearchQuery("")}
//                   aria-label="Clear search"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           </form>

//           <div className="quick-links">
//             <h3>Quick Links</h3>
//             <div className="quick-links-grid">
//               {/* Dynamic quick links based on auth status */}
//               {!authCtx.isLoggedIn ? (
//                 <>
//                   <Link href="/about" className="quick-link-item">
//                     <span className="quick-link-icon">ℹ️</span>
//                     <span className="quick-link-text">About Us</span>
//                   </Link>
//                   <Link href="/menu" className="quick-link-item">
//                     <span className="quick-link-icon">🍽️</span>
//                     <span className="quick-link-text">Our Menu</span>
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link href="/favorites" className="quick-link-item">
//                     <span className="quick-link-icon">❤️</span>
//                     <span className="quick-link-text">Favorites</span>
//                   </Link>
//                   <Link href="/order-history" className="quick-link-item">
//                     <span className="quick-link-icon">📋</span>
//                     <span className="quick-link-text">Order History</span>
//                   </Link>
//                 </>
//               )}

//               <Link href="/stores" className="quick-link-item">
//                 <span className="quick-link-icon">📍</span>
//                 <span className="quick-link-text">Find a Store</span>
//               </Link>

//               <Link href="/deals" className="quick-link-item">
//                 <span className="quick-link-icon">🎯</span>
//                 <span className="quick-link-text">Today's Deals</span>
//               </Link>

//               {authCtx.isLoggedIn && (
//                 <Link href="/meal-plans" className="quick-link-item">
//                   <span className="quick-link-icon">🎒</span>
//                   <span className="quick-link-text">Meal Plans</span>
//                 </Link>
//               )}

//               <Link href="/nutrition" className="quick-link-item">
//                 <span className="quick-link-icon">🥗</span>
//                 <span className="quick-link-text">Nutrition Info</span>
//               </Link>

//               {authCtx.isLoggedIn && (
//                 <Link href="/rewards" className="quick-link-item">
//                   <span className="quick-link-icon">🎁</span>
//                   <span className="quick-link-text">Rewards Program</span>
//                 </Link>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
//       )}
//     </>
//   );
// };

// export default Navbar;

//

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
