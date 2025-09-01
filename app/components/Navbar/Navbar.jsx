"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "./Navbar.css";
import NavLink from "./NavLink";

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const searchToggle = document.querySelector(".search-toggle");
        if (searchToggle && !searchToggle.contains(event.target)) {
          setIsSearchExpanded(false);
        }
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
              {/* <Link href="/" className="navbar-link">
                Home
              </Link> */}
              <NavLink href="/home" className="navbar-link">
                Home
              </NavLink>
            </li>
            <li className="navbar-item">
              {/* <Link href="/menu" className="navbar-link">
                Menu
              </Link> */}
              <NavLink href={"/menu"} className="navbar-link">
                Menu
              </NavLink>
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
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchRef}
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
              <a href="#" className="quick-link-item">
                <span className="quick-link-icon">📍</span>
                <span className="quick-link-text">Find a Store</span>
              </a>
              <a href="#" className="quick-link-item">
                <span className="quick-link-icon">👓</span>
                <span className="quick-link-text">Food Vision Pro</span>
              </a>
              <a href="#" className="quick-link-item">
                <span className="quick-link-icon">🎒</span>
                <span className="quick-link-text">MealPack</span>
              </a>
              <a href="#" className="quick-link-item">
                <span className="quick-link-icon">🧠</span>
                <span className="quick-link-text">Food Intelligence</span>
              </a>
              <a href="#" className="quick-link-item">
                <span className="quick-link-icon">🔄</span>
                <span className="quick-link-text">Food Trade In</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
