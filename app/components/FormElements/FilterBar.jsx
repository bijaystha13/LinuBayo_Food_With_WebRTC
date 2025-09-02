"use client";

import { useState } from "react";
import styles from "./FilterBar.module.css";

export default function FilterBar({
  categories,
  selectedCategory,
  searchQuery,
  priceRange,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onPriceRangeChange,
  onSortChange,
  onClearFilters,
  totalItems,
}) {
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseFloat(value);
    onPriceRangeChange(newRange);
  };

  return (
    <div className={styles.filterBar}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className={styles.clearSearch}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categorySection}>
        <h3 className={styles.filterTitle}>Categories</h3>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`${styles.categoryBtn} ${
                selectedCategory === category.value ? styles.active : ""
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.controlsRow}>
          {/* Sort Dropdown */}
          <div className={styles.sortSection}>
            <label className={styles.controlLabel}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>

          {/* Price Filter Toggle */}
          <button
            onClick={() => setShowPriceFilter(!showPriceFilter)}
            className={`${styles.priceToggle} ${
              showPriceFilter ? styles.active : ""
            }`}
          >
            💰 Price Range
          </button>

          {/* Clear Filters */}
          <button onClick={onClearFilters} className={styles.clearBtn}>
            Clear All
          </button>

          {/* Results Count */}
          <div className={styles.resultsCount}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Price Range Slider */}
        {showPriceFilter && (
          <div className={styles.priceRangeSection}>
            <div className={styles.priceInputs}>
              <div className={styles.priceInputGroup}>
                <label>Min Price:</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className={styles.priceInput}
                />
              </div>
              <div className={styles.priceInputGroup}>
                <label>Max Price:</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className={styles.priceInput}
                />
              </div>
            </div>
            <div className={styles.priceDisplay}>
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
