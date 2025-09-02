"use client";

import { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "@/app/shared/hooks/http-hook";
import { toast } from "react-toastify";
import styles from "./Menu.module.css";
import FilterBar from "../components/FormElements/FilterBar";
import FoodList from "@/app/components/FoodsComponents/FoodsList";
import Pagination from "@/app/components/FormElements/Pagination";
import CustomerChats from "../components/Customer/CustomerChats";

const FOOD_CATEGORIES = [
  { value: "all", label: "All Items", icon: "🍽️" },
  { value: "appetizer", label: "Appetizers", icon: "🥗" },
  { value: "main", label: "Main Courses", icon: "🍖" },
  { value: "dessert", label: "Desserts", icon: "🍰" },
  { value: "beverage", label: "Beverages", icon: "🥤" },
  { value: "salad", label: "Salads", icon: "🥬" },
  { value: "soup", label: "Soups", icon: "🍲" },
  { value: "pizza", label: "Pizza", icon: "🍕" },
  { value: "fast food", label: "Fast Food", icon: "🍔" },
  { value: "italian", label: "Italian", icon: "🍝" },
];

export default function MenuPage() {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedFoods, setLoadedFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("name");
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const API_BASE = "http://localhost:5001";

  // Build query parameters for API calls
  const buildQueryParams = useCallback(
    (page = currentPage) => {
      const params = new URLSearchParams();

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (priceRange[0] > 0) {
        params.append("minPrice", priceRange[0].toString());
      }

      if (priceRange[1] < 1000) {
        params.append("maxPrice", priceRange[1].toString());
      }

      // Map sortBy values to backend format
      let backendSortBy = "name";
      let order = "asc";

      switch (sortBy) {
        case "price-low":
          backendSortBy = "price";
          order = "asc";
          break;
        case "price-high":
          backendSortBy = "price";
          order = "desc";
          break;
        case "name":
        default:
          backendSortBy = "name";
          order = "asc";
          break;
      }

      params.append("sortBy", backendSortBy);
      params.append("order", order);
      params.append("page", page.toString());
      params.append("limit", itemsPerPage.toString());

      return params.toString();
    },
    [
      selectedCategory,
      searchQuery,
      priceRange,
      sortBy,
      currentPage,
      itemsPerPage,
    ]
  );

  // Initialize empty state
  const initializeEmptyState = useCallback(
    (page = 1) => {
      setLoadedFoods([]);
      setPagination({
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: itemsPerPage,
        hasNextPage: false,
        hasPrevPage: false,
      });
      setCurrentPage(page);
    },
    [itemsPerPage]
  );

  // Unified fetch function for both "all" and category-specific requests
  const fetchFoods = useCallback(
    async (page = 1, resetPage = false) => {
      try {
        const targetPage = resetPage ? 1 : page;
        let responseData;

        if (selectedCategory === "all") {
          // Use the general foods endpoint with category filter
          const queryParams = buildQueryParams(targetPage);
          responseData = await sendRequest(
            `${API_BASE}/api/foods?${queryParams}`
          );
        } else {
          // Use category-specific endpoint
          const params = new URLSearchParams();

          if (searchQuery.trim()) {
            params.append("search", searchQuery.trim());
          }
          if (priceRange[0] > 0) {
            params.append("minPrice", priceRange[0].toString());
          }
          if (priceRange[1] < 1000) {
            params.append("maxPrice", priceRange[1].toString());
          }

          let backendSortBy = "name";
          let order = "asc";
          switch (sortBy) {
            case "price-low":
              backendSortBy = "price";
              order = "asc";
              break;
            case "price-high":
              backendSortBy = "price";
              order = "desc";
              break;
            case "name":
            default:
              backendSortBy = "name";
              order = "asc";
              break;
          }
          params.append("sortBy", backendSortBy);
          params.append("order", order);
          params.append("page", targetPage.toString());
          params.append("limit", itemsPerPage.toString());

          const queryString = params.toString();
          const url = `${API_BASE}/api/foods/category/${selectedCategory}${
            queryString ? `?${queryString}` : ""
          }`;

          console.log(`Fetching category ${selectedCategory} from:`, url);
          responseData = await sendRequest(url);
        }

        // Handle response data consistently
        if (responseData) {
          // Check for paginated response structure
          if (responseData.foods && responseData.pagination) {
            // Response from /api/foods endpoint
            setLoadedFoods(responseData.foods);
            setPagination(responseData.pagination);
            setCurrentPage(targetPage);
          } else if (responseData.products && responseData.pagination) {
            // Response from /api/foods/category endpoint with pagination
            setLoadedFoods(responseData.products);
            setPagination(responseData.pagination);
            setCurrentPage(targetPage);
          } else if (
            responseData.products &&
            Array.isArray(responseData.products)
          ) {
            // Response from /api/foods/category endpoint without pagination
            // Apply frontend pagination
            const totalItems = responseData.products.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (targetPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedProducts = responseData.products.slice(
              startIndex,
              endIndex
            );

            setLoadedFoods(paginatedProducts);
            setPagination({
              currentPage: targetPage,
              totalPages,
              totalItems,
              itemsPerPage,
              hasNextPage: targetPage < totalPages,
              hasPrevPage: targetPage > 1,
            });
            setCurrentPage(targetPage);
          } else if (Array.isArray(responseData)) {
            // Direct array response (fallback)
            const totalItems = responseData.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            const startIndex = (targetPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = responseData.slice(startIndex, endIndex);

            setLoadedFoods(paginatedData);
            setPagination({
              currentPage: targetPage,
              totalPages,
              totalItems,
              itemsPerPage,
              hasNextPage: targetPage < totalPages,
              hasPrevPage: targetPage > 1,
            });
            setCurrentPage(targetPage);
          } else {
            // Empty or unexpected response
            console.log("Empty or unexpected response:", responseData);
            initializeEmptyState(targetPage);
          }
        } else {
          // No response data
          console.log("No response data received");
          initializeEmptyState(targetPage);
        }
      } catch (err) {
        console.error("Failed to fetch foods:", err);
        toast.error("Failed to load menu items");
        initializeEmptyState(targetPage);
      }
    },
    [
      selectedCategory,
      searchQuery,
      priceRange,
      sortBy,
      itemsPerPage,
      buildQueryParams,
      sendRequest,
      initializeEmptyState,
    ]
  );

  // Combined effect to handle all filter changes
  useEffect(() => {
    fetchFoods(1, true);
  }, [fetchFoods]);

  // Initial load - removed duplicate useEffect

  const handleCategoryChange = (category) => {
    console.log(`Category changed to: ${category}`);
    setSelectedCategory(category);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setPriceRange([0, 1000]);
    setSortBy("name");
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchFoods(page);

      // Scroll to top of menu content
      document.querySelector(`.${styles.menuContent}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  };

  const foodDeletedHandler = useCallback(
    async (deletedFoodId) => {
      setIsDeleting(true);
      try {
        await sendRequest(`${API_BASE}/api/foods/${deletedFoodId}`, "DELETE");

        // Refresh the current page after deletion
        await fetchFoods(currentPage);

        toast.success("Food item deleted successfully!");
      } catch {
        toast.error("Failed to delete food item");
      } finally {
        setIsDeleting(false);
      }
    },
    [sendRequest, fetchFoods, currentPage]
  );

  // Get current category info for display
  const getCurrentCategory = () => {
    return (
      FOOD_CATEGORIES.find((cat) => cat.value === selectedCategory) ||
      FOOD_CATEGORIES[0]
    );
  };

  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuHeader}>
        <h1 className={styles.menuTitle}>
          {getCurrentCategory().icon} Our Menu
        </h1>
        <p className={styles.menuSubtitle}>
          {selectedCategory === "all"
            ? "Discover our delicious selection of carefully crafted dishes"
            : `Explore our ${getCurrentCategory().label} selection`}
        </p>
      </div>

      <FilterBar
        categories={FOOD_CATEGORIES}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        priceRange={priceRange}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onPriceRangeChange={handlePriceRangeChange}
        onSortChange={handleSortChange}
        onClearFilters={clearFilters}
        totalItems={pagination.totalItems}
      />

      <div className={styles.menuContent}>
        {/* Results summary */}
        {!isLoading && !isDeleting && loadedFoods.length > 0 && (
          <div className={styles.resultsInfo}>
            <p>
              {getCurrentCategory().icon} Showing{" "}
              {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of{" "}
              {pagination.totalItems}{" "}
              {selectedCategory === "all"
                ? "items"
                : getCurrentCategory().label.toLowerCase()}
              {pagination.totalPages > 1 &&
                ` (Page ${currentPage} of ${pagination.totalPages})`}
            </p>
          </div>
        )}

        {(isLoading || isDeleting) && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && !isDeleting && loadedFoods.length > 0 && (
          <>
            <FoodList
              items={loadedFoods}
              onDeleteProduct={foodDeletedHandler}
            />

            {/* Pagination Component */}
            {pagination.totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  onPreviousPage={handlePreviousPage}
                  onNextPage={handleNextPage}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
              </div>
            )}
          </>
        )}

        {!isLoading &&
          !isDeleting &&
          loadedFoods.length === 0 &&
          pagination.totalItems === 0 &&
          (searchQuery || priceRange[0] > 0 || priceRange[1] < 1000) && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                {getCurrentCategory().icon}
              </div>
              <h3>
                No {getCurrentCategory().label.toLowerCase()} match your filters
              </h3>
              <p>Try adjusting your search criteria or clear all filters</p>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                Clear All Filters
              </button>
            </div>
          )}

        {!isLoading &&
          !isDeleting &&
          loadedFoods.length === 0 &&
          pagination.totalItems === 0 &&
          !searchQuery &&
          priceRange[0] === 0 &&
          priceRange[1] === 1000 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>
                {getCurrentCategory().icon}
              </div>
              <h3>
                {selectedCategory === "all"
                  ? "No menu items found"
                  : `No ${getCurrentCategory().label.toLowerCase()} available`}
              </h3>
              <p>
                {selectedCategory === "all"
                  ? "Please check back later or contact us for more information"
                  : `We currently don't have any ${getCurrentCategory().label.toLowerCase()} in stock. Please check other categories or contact us.`}
              </p>
            </div>
          )}
      </div>

      {/* Floating Chat Widget - Add this at the end */}
      <CustomerChats isFloating={true} />
    </div>
  );
}
