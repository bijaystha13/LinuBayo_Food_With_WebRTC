"use client";
import { useAuth } from "../shared/hooks/auth-hook";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Star,
  ShoppingBag,
  Loader,
  ArrowLeft,
  Filter,
  Search,
  Grid3x3,
  List,
  SortAsc,
  Trash2,
} from "lucide-react";
import { useHttpClient } from "../shared/hooks/http-hook";
import styles from "./FavoritesPage.module.css";

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='0.3em' font-family='sans-serif' font-size='14' fill='%236b7280'%3ENo Image%3C/text%3E%3C/svg%3E";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("recent"); // recent, name, price, rating
  const [removingId, setRemovingId] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const { token, isLoggedIn } = useAuth();
  const router = useRouter();
  const { sendRequest } = useHttpClient();

  const handleImageError = useCallback(
    (imageUrl) => (e) => {
      if (!imageErrors.has(imageUrl)) {
        setImageErrors((prev) => new Set(prev).add(imageUrl));
        e.target.src = fallbackImage;
      }
    },
    [imageErrors]
  );

  const fetchFavorites = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!isLoggedIn || !token) {
        router.push("/auth?mode=login");
        return;
      }

      const response = await sendRequest(
        "http://localhost:5001/api/users/favorites",
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response?.success) {
        setFavorites(response.data || []);
        setFilteredFavorites(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    } finally {
      setIsLoading(false);
    }
  }, [sendRequest, router, isLoggedIn, token]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Filter and sort favorites
  useEffect(() => {
    let filtered = [...favorites];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "recent":
      default:
        // Keep original order (most recent first)
        break;
    }

    setFilteredFavorites(filtered);
  }, [searchQuery, sortBy, favorites]);

  const handleRemoveFavorite = async (itemId) => {
    try {
      setRemovingId(itemId);

      const response = await sendRequest(
        `http://localhost:5001/api/users/favorites/${itemId}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response?.success) {
        setFavorites((prev) => prev.filter((item) => item.id !== itemId));
        setFilteredFavorites((prev) =>
          prev.filter((item) => item.id !== itemId)
        );
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    } finally {
      setRemovingId(null);
    }
  };

  const SafeImage = ({ src, alt, className, ...props }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError(src)}
      {...props}
    />
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <Loader className={styles.spinner} />
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Back
          </button>

          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.pageTitle}>
                <Heart size={32} />
                Your Favorites
              </h1>
              <p className={styles.subtitle}>
                {favorites.length} item{favorites.length !== 1 ? "s" : ""} you
                love
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.actions}>
            <div className={styles.sortDropdown}>
              <SortAsc size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.select}
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className={styles.viewToggle}>
              <button
                onClick={() => setViewMode("grid")}
                className={`${styles.viewBtn} ${
                  viewMode === "grid" ? styles.active : ""
                }`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`${styles.viewBtn} ${
                  viewMode === "list" ? styles.active : ""
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Grid/List */}
        {filteredFavorites.length > 0 ? (
          <div
            className={
              viewMode === "grid" ? styles.favoritesGrid : styles.favoritesList
            }
          >
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className={
                  viewMode === "grid" ? styles.gridItem : styles.listItem
                }
              >
                <div className={styles.itemImageWrap}>
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.ratingBadge}>
                    <Star size={14} />
                    {item.rating}
                  </div>

                  <button
                    onClick={() => handleRemoveFavorite(item.id)}
                    disabled={removingId === item.id}
                    className={styles.favoriteBtn}
                  >
                    <Heart
                      size={20}
                      fill="#ff6b35"
                      className={removingId === item.id ? styles.removing : ""}
                    />
                  </button>
                </div>

                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>
                    {item.description || "Delicious item from our menu"}
                  </p>

                  <div className={styles.itemMeta}>
                    <span className={styles.itemPrice}>${item.price}</span>
                    <span className={styles.orderCount}>
                      Ordered {item.orderCount} time
                      {item.orderCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className={styles.itemActions}>
                    <button
                      onClick={() => router.push(`/menu/${item.id}`)}
                      className={styles.addToCartBtn}
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemoveFavorite(item.id)}
                      disabled={removingId === item.id}
                      className={styles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Heart size={64} />
            <h2>No favorites yet</h2>
            <p>
              {searchQuery
                ? "No items match your search"
                : "Start adding items you love to your favorites!"}
            </p>
            <button
              onClick={() =>
                searchQuery ? setSearchQuery("") : router.push("/menu")
              }
              className={styles.browseBtn}
            >
              {searchQuery ? "Clear Search" : "Browse Menu"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
