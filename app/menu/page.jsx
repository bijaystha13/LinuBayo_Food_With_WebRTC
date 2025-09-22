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

// Network detection utilities
const checkNetworkConnectivity = async () => {
  try {
    // Check if navigator.onLine is available (basic check)
    if (!navigator.onLine) {
      return false;
    }

    // Try to fetch a small resource to verify actual connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("/favicon.ico", {
      method: "HEAD",
      cache: "no-cache",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

const isNetworkError = (error) => {
  // Check for various network error indicators
  return (
    !navigator.onLine ||
    error?.name === "NetworkError" ||
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("fetch") ||
    error?.message?.includes("NetworkError") ||
    error?.message?.includes("Failed to fetch") ||
    error?.message?.toLowerCase().includes("network") ||
    error?.message?.toLowerCase().includes("connection") ||
    error?.cause?.code === "ENOTFOUND" ||
    error?.cause?.code === "ECONNREFUSED" ||
    error?.cause?.code === "ETIMEDOUT"
  );
};

export default function MenuPage() {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedFoods, setLoadedFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("name");
  const [isDeleting, setIsDeleting] = useState(false);

  // Add initialization tracking
  const [hasInitialized, setHasInitialized] = useState(false);
  const [renderError, setRenderError] = useState(null);

  // Network state tracking
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkChecking, setNetworkChecking] = useState(false);

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

  // Network event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("Network: Online");
      // Optionally refetch data when coming back online
      if (hasInitialized) {
        fetchFoods(currentPage);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Network: Offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [hasInitialized, currentPage]);

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

  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Enhanced error handling with network detection
  const handleFetchError = async (error, targetPage) => {
    console.error("Fetch error details:", error);

    // First check if it's a network connectivity issue
    const networkConnected = await checkNetworkConnectivity();

    if (!networkConnected || isNetworkError(error)) {
      // Create a network-specific error
      const networkError = new Error(
        "No internet connection. Please check your network and try again."
      );
      networkError.name = "NetworkError";
      networkError.isNetworkError = true;

      if (isInitialLoad || !hasInitialized) {
        setRenderError(networkError);
        return;
      } else {
        toast.error(
          "Network connection lost. Please check your internet connection."
        );
        initializeEmptyState(targetPage);
        return;
      }
    }

    // Handle other errors (server down, API errors, etc.)
    if (isInitialLoad || !hasInitialized) {
      setRenderError(error);
      return;
    }

    // For subsequent requests (filtering, pagination), handle gracefully
    toast.error("Failed to load menu items");
    initializeEmptyState(targetPage);
  };

  // Unified fetch function for both "all" and category-specific requests
  const fetchFoods = useCallback(
    async (page = 1, resetPage = false) => {
      try {
        // Quick network check before making request
        setNetworkChecking(true);
        const networkConnected = await checkNetworkConnectivity();
        setNetworkChecking(false);

        if (!networkConnected) {
          const networkError = new Error(
            "No internet connection. Please check your network and try again."
          );
          networkError.name = "NetworkError";
          networkError.isNetworkError = true;
          throw networkError;
        }

        const targetPage = resetPage ? 1 : page;
        setCurrentPage(targetPage);

        let responseData;

        if (selectedCategory === "all") {
          // Build query params for "all" category
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
          params.append("page", targetPage.toString());
          params.append("limit", itemsPerPage.toString());

          const queryParams = params.toString();
          responseData = await sendRequest(
            `${API_BASE}/api/foods?${queryParams}`
          );
        } else {
          // Build query params for specific category
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
          } else if (responseData.products && responseData.pagination) {
            // Response from /api/foods/category endpoint with pagination
            setLoadedFoods(responseData.products);
            setPagination(responseData.pagination);
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

        // Mark as successfully initialized
        setHasInitialized(true);
        setIsInitialLoad(false);
      } catch (err) {
        await handleFetchError(err, resetPage ? 1 : page);
      }
    },
    [
      selectedCategory,
      searchQuery,
      priceRange,
      sortBy,
      itemsPerPage,
      sendRequest,
      initializeEmptyState,
      isInitialLoad,
      hasInitialized,
    ]
  );

  // Effect for initial load
  useEffect(() => {
    fetchFoods(1, true);
  }, []);

  // Effect for filter changes (reset to page 1)
  useEffect(() => {
    if (
      hasInitialized && // Only refetch if we've initialized once
      (selectedCategory ||
        searchQuery ||
        priceRange[0] > 0 ||
        priceRange[1] < 1000 ||
        sortBy !== "name")
    ) {
      fetchFoods(1, true);
    }
  }, [
    selectedCategory,
    searchQuery,
    priceRange,
    sortBy,
    fetchFoods,
    hasInitialized,
  ]);

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
        // Check network before attempting delete
        const networkConnected = await checkNetworkConnectivity();
        if (!networkConnected) {
          toast.error("Cannot delete item: No internet connection");
          return;
        }

        await sendRequest(`${API_BASE}/api/foods/${deletedFoodId}`, "DELETE");

        // Refresh the current page after deletion
        await fetchFoods(currentPage);

        toast.success("Food item deleted successfully!");
      } catch (error) {
        console.error("Delete error:", error);
        if (isNetworkError(error)) {
          toast.error("Delete failed: Network connection lost");
        } else {
          toast.error("Failed to delete food item");
        }
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

  // Show error page if there's an error and we haven't initialized yet
  // Throw during render to trigger Next.js error boundary
  if (renderError && !hasInitialized) {
    throw renderError;
  }

  return (
    <div className={styles.menuContainer}>
      {/* Network Status Indicator */}
      {!isOnline && (
        <div className={styles.networkWarning}>
          <span>
            ⚠️ No internet connection. Some features may not work properly.
          </span>
        </div>
      )}

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
        {!isLoading &&
          !isDeleting &&
          !networkChecking &&
          loadedFoods.length > 0 && (
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

        {(isLoading || isDeleting || networkChecking) && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
            {networkChecking && <p>Checking network connectivity...</p>}
          </div>
        )}

        {!isLoading &&
          !isDeleting &&
          !networkChecking &&
          loadedFoods.length > 0 && (
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
          !networkChecking &&
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
          !networkChecking &&
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

      {/* Floating Chat Widget */}
      <CustomerChats isFloating={true} />
    </div>
  );
}
