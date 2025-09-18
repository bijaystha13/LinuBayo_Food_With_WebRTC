"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useForm } from "@/app/shared/hooks/form-hook";
import { useHttpClient } from "@/app/shared/hooks/http-hook";
import LoadingSpinner from "@/app/shared/UIElements/LoadingSpinner";
import styles from "./AdminCreateFood.module.css";

const FOOD_CATEGORIES = [
  { value: "", label: "Select Category" },
  { value: "appetizer", label: "Appetizers" },
  { value: "main", label: "Main Courses" },
  { value: "dessert", label: "Desserts" },
  { value: "beverage", label: "Beverages" },
  { value: "salad", label: "Salads" },
  { value: "soup", label: "Soups" },
  { value: "pizza", label: "Pizza" },
  { value: "fast food", label: "Fast Food" },
  { value: "italian", label: "Italian" },
];

const AdminCreateFood = ({ onFoodCreated }) => {
  const { isLoading, sendRequest } = useHttpClient();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      price: {
        value: "",
        isValid: false,
      },
      quantity: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.isValid) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select an image for the food item");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("price", formState.inputs.price.value);
      formData.append("quantity", formState.inputs.quantity.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("image", selectedFile);

      const responseData = await sendRequest(
        "http://localhost:5001/api/foods/add",
        "POST",
        formData
      );

      if (responseData.success) {
        toast.success("Food item created successfully!");

        // Reset form
        setFormData(
          {
            name: { value: "", isValid: false },
            description: { value: "", isValid: false },
            price: { value: "", isValid: false },
            quantity: { value: "", isValid: false },
            category: { value: "", isValid: false },
          },
          false
        );

        // Reset image
        handleRemoveImage();

        // Call callback if provided
        if (onFoodCreated) {
          onFoodCreated(responseData.food);
        }
      }
    } catch (error) {
      console.error("Error creating food:", error);
      toast.error(
        error.message || "Failed to create food item. Please try again."
      );
    }
  };

  const validateInput = (id, value) => {
    switch (id) {
      case "name":
        return value.trim().length > 0 && value.trim().length <= 100;
      case "description":
        return value.trim().length > 0 && value.trim().length <= 500;
      case "price":
        const price = parseFloat(value);
        return !isNaN(price) && price > 0 && price <= 10000;
      case "quantity":
        const quantity = parseInt(value);
        return !isNaN(quantity) && quantity >= 0 && quantity <= 10000;
      case "category":
        return value.trim().length > 0;
      default:
        return true;
    }
  };

  const handleInputChange = (id, value) => {
    const isValid = validateInput(id, value);
    inputHandler(id, value, isValid);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Create New Food Item</h2>
        <p className={styles.formSubtitle}>
          Add a delicious new item to your menu
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Image Upload Section */}
        <div className={styles.imageSection}>
          <label className={styles.imageLabel}>Food Image *</label>

          {!previewImage ? (
            <div
              className={styles.imageUpload}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadContent}>
                <div className={styles.uploadIcon}>📷</div>
                <p className={styles.uploadText}>Click to upload image</p>
                <p className={styles.uploadSubtext}>
                  JPEG, PNG, WebP (Max 5MB)
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.imagePreview}>
              <img
                src={previewImage}
                alt="Preview"
                className={styles.previewImg}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.removeImageBtn}
              >
                ✕
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hiddenFileInput}
          />
        </div>

        {/* Form Fields */}
        <div className={styles.formGrid}>
          {/* Name Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Food Name *
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter food name"
              value={formState.inputs.name.value}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`${styles.input} ${
                formState.inputs.name.value && !formState.inputs.name.isValid
                  ? styles.inputError
                  : ""
              }`}
              maxLength={100}
            />
            {formState.inputs.name.value && !formState.inputs.name.isValid && (
              <span className={styles.errorText}>
                Name is required and must be less than 100 characters
              </span>
            )}
          </div>

          {/* Category Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="category" className={styles.label}>
              Category *
            </label>
            <select
              id="category"
              value={formState.inputs.category.value}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`${styles.select} ${
                formState.inputs.category.value &&
                !formState.inputs.category.isValid
                  ? styles.inputError
                  : ""
              }`}
            >
              {FOOD_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {formState.inputs.category.value &&
              !formState.inputs.category.isValid && (
                <span className={styles.errorText}>
                  Please select a category
                </span>
              )}
          </div>

          {/* Price Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="price" className={styles.label}>
              Price ($) *
            </label>
            <input
              id="price"
              type="number"
              placeholder="0.00"
              min="0"
              max="10000"
              step="0.01"
              value={formState.inputs.price.value}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className={`${styles.input} ${
                formState.inputs.price.value && !formState.inputs.price.isValid
                  ? styles.inputError
                  : ""
              }`}
            />
            {formState.inputs.price.value &&
              !formState.inputs.price.isValid && (
                <span className={styles.errorText}>
                  Please enter a valid price (0.01 - 10000)
                </span>
              )}
          </div>

          {/* Quantity Field */}
          <div className={styles.inputGroup}>
            <label htmlFor="quantity" className={styles.label}>
              Quantity Available *
            </label>
            <input
              id="quantity"
              type="number"
              placeholder="0"
              min="0"
              max="10000"
              value={formState.inputs.quantity.value}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              className={`${styles.input} ${
                formState.inputs.quantity.value &&
                !formState.inputs.quantity.isValid
                  ? styles.inputError
                  : ""
              }`}
            />
            {formState.inputs.quantity.value &&
              !formState.inputs.quantity.isValid && (
                <span className={styles.errorText}>
                  Please enter a valid quantity (0 - 10000)
                </span>
              )}
          </div>
        </div>

        {/* Description Field */}
        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>
            Description *
          </label>
          <textarea
            id="description"
            placeholder="Describe your delicious food item..."
            rows={4}
            value={formState.inputs.description.value}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={`${styles.textarea} ${
              formState.inputs.description.value &&
              !formState.inputs.description.isValid
                ? styles.inputError
                : ""
            }`}
            maxLength={500}
          />
          <div className={styles.textareaFooter}>
            {formState.inputs.description.value &&
              !formState.inputs.description.isValid && (
                <span className={styles.errorText}>
                  Description is required and must be less than 500 characters
                </span>
              )}
            <span className={styles.charCount}>
              {formState.inputs.description.value.length}/500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button
            type="submit"
            disabled={!formState.isValid || !selectedFile || isLoading}
            className={styles.submitBtn}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="small" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Create Food Item</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateFood;
