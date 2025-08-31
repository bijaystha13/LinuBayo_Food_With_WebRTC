// components/Navbar.js
"use client";
import { useState } from "react";
import Link from "next/link";
import "./Navbar.css";

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded && searchQuery) {
      // Perform search action here
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">🍔</span>
          FoodExpress
        </Link>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link href="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/menu" className="navbar-link">
              Menu
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/about" className="navbar-link">
              About
            </Link>
          </li>
          <li className="navbar-item">
            <Link href="/contact" className="navbar-link">
              Contact
            </Link>
          </li>
        </ul>

        <div className="navbar-search-container">
          <form
            onSubmit={handleSearchSubmit}
            className={`search-form ${isSearchExpanded ? "expanded" : ""}`}
          >
            <input
              type="text"
              className="search-input"
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="search-submit"
              aria-label="Submit search"
            >
              <span className="search-submit-icon">🔍</span>
            </button>
          </form>
          <button
            className="search-toggle"
            onClick={handleSearchToggle}
            aria-label={isSearchExpanded ? "Collapse search" : "Expand search"}
          >
            <span className="search-icon">🔍</span>
          </button>
        </div>

        <div className="navbar-actions">
          <button className="navbar-button cart-button">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">3</span>
          </button>
          <button className="navbar-button account-button">
            <span className="account-icon">👤</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
