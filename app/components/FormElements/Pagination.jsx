// components/UI/Pagination.js
"use client";

import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onPreviousPage,
  onNextPage,
  hasNextPage,
  hasPrevPage,
  maxVisiblePages = 5,
}) => {
  // Calculate which pages to show
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationControls}>
        {/* Previous Button */}
        <button
          onClick={onPreviousPage}
          disabled={!hasPrevPage}
          className={`${styles.paginationBtn} ${styles.prevNext} ${
            !hasPrevPage ? styles.disabled : ""
          }`}
          aria-label="Previous page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        <div className={styles.pageNumbers}>
          {/* First page + ellipsis */}
          {visiblePages[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className={styles.paginationBtn}
              >
                1
              </button>
              {visiblePages[0] > 2 && (
                <span className={styles.ellipsis}>...</span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${styles.paginationBtn} ${
                page === currentPage ? styles.active : ""
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page + ellipsis */}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <>
              {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                <span className={styles.ellipsis}>...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className={styles.paginationBtn}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className={`${styles.paginationBtn} ${styles.prevNext} ${
            !hasNextPage ? styles.disabled : ""
          }`}
          aria-label="Next page"
        >
          Next
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Page info */}
      <div className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
