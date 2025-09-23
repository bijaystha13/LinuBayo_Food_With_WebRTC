"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/shared/Context/AuthContext";
import { useHttpClient } from "@/app/shared/hooks/http-hook";
import { useForm } from "@/app/shared/hooks/form-hook";
import LoadingSpinner from "@/app/shared/UIElements/LoadingSpinner";
import styles from "./AdminUpdateFood.module.css";
import {
  FaArrowLeft,
  FaImage,
  FaSave,
  FaTimes,
  FaSpinner,
  FaEye,
  FaEdit,
} from "react-icons/fa";

const VALIDATORS = {
  REQUIRE: () => (val) => val.trim().length > 0,
  MINLENGTH: (val) => (inputVal) => inputVal.trim().length >= val,
  MIN: (val) => (inputVal) => +inputVal >= val,
  MAX: (val) => (inputVal) => +inputVal <= val,
};

const validate = (value, validators) => {
  let isValid = true;
  for (const validator of validators) {
    isValid = isValid && validator(value);
  }
  return isValid;
};

const FOOD_CATEGORIES = [
  "appetizer",
  "main",
  "dessert",
  "beverage",
  "salad",
  "soup",
  "pizza",
  "fast food",
  "italian",
];

// Simple Input Component
const Input = ({
  id,
  element,
  type,
  label,
  validators = [],
  errorText,
  onInput,
  initialValue = "",
  initialValid = false,
  children,
  ...props
}) => {
  const [inputState, setInputState] = useState({
    value: initialValue,
    isTouched: false,
    isValid: initialValid,
  });

  const { value, isValid, isTouched } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    const newValue = event.target.value;
    const newIsValid = validate(newValue, validators);
    setInputState({
      ...inputState,
      value: newValue,
      isValid: newIsValid,
    });
  };

  const touchHandler = () => {
    setInputState({
      ...inputState,
      isTouched: true,
    });
  };

  const elementToRender =
    element === "input" ? (
      <input
        id={id}
        type={type}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={value}
        {...props}
      />
    ) : element === "textarea" ? (
      <textarea
        id={id}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={value}
        {...props}
      />
    ) : (
      <select
        id={id}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={value}
        {...props}
      >
        {children}
      </select>
    );

  return (
    <div
      className={`${styles.inputGroup} ${
        !isValid && isTouched ? styles.invalid : ""
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {elementToRender}
      {!isValid && isTouched && <p className={styles.errorText}>{errorText}</p>}
    </div>
  );
};

// Simple Button Component
const Button = ({ children, className = "", ...props }) => {
  return (
    <button className={`${styles.btn} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function AdminUpdateFood() {
  const router = useRouter();
  const params = useParams();
  const { foodId } = params;

  const authCtx = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();

  const [loadedFood, setLoadedFood] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingFood, setIsLoadingFood] = useState(true);

  const fileInputRef = useRef();

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

  // Check if user is admin
  const isAdmin = authCtx.isLoggedIn && authCtx.role === "admin";

  // Redirect if not admin
  useEffect(() => {
    if (!authCtx.isLoggedIn) {
      toast.error("Please login to access this page");
      router.push("/auth");
      return;
    }

    if (!isAdmin) {
      toast.error("You don't have permission to edit food items");
      router.push("/menu");
      return;
    }
  }, [authCtx.isLoggedIn, isAdmin, router]);

  // Fetch food data
  useEffect(() => {
    const fetchFood = async () => {
      if (!foodId || !isAdmin) return;

      try {
        setIsLoadingFood(true);
        const responseData = await sendRequest(
          `http://localhost:5001/api/foods/${foodId}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${authCtx.token}`,
          }
        );

        if (responseData.success && responseData.food) {
          const food = responseData.food;
          setLoadedFood(food);

          // Set preview image
          if (food.image) {
            setPreviewImage(`http://localhost:5001/${food.image}`);
          }

          // Set form data
          setFormData(
            {
              name: {
                value: food.name || "",
                isValid: true,
              },
              description: {
                value: food.description || "",
                isValid: true,
              },
              price: {
                value: food.price?.toString() || "",
                isValid: true,
              },
              quantity: {
                value: food.quantity?.toString() || "",
                isValid: true,
              },
              category: {
                value: food.category || "",
                isValid: true,
              },
            },
            true
          );
        } else {
          throw new Error("Food item not found");
        }
      } catch (error) {
        console.error("Error fetching food:", error);
        toast.error("Failed to load food details");
        router.push("/menu");
      } finally {
        setIsLoadingFood(false);
      }
    };

    fetchFood();
  }, [foodId, isAdmin, sendRequest, authCtx.token, setFormData, router]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (loadedFood?.image) {
      setPreviewImage(`http://localhost:5001/${loadedFood.image}`);
    } else {
      setPreviewImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formState.isValid) {
      toast.error("Please fix all form errors before submitting");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", formState.inputs.name.value.trim());
      formData.append("description", formState.inputs.description.value.trim());
      formData.append("price", parseFloat(formState.inputs.price.value));
      formData.append("quantity", parseInt(formState.inputs.quantity.value));
      formData.append("category", formState.inputs.category.value);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const responseData = await sendRequest(
        `http://localhost:5001/api/foods/${foodId}`,
        "PATCH",
        formData,
        {
          Authorization: `Bearer ${authCtx.token}`,
        }
      );

      if (responseData.success) {
        toast.success("Food item updated successfully!");
        router.push("/menu");
      } else {
        throw new Error(responseData.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      toast.error(error.message || "Failed to update food item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/menu");
  };

  const handlePreview = () => {
    if (foodId) {
      router.push(`/product/${foodId}`);
    }
  };

  // Show loading spinner while fetching data
  if (isLoadingFood) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
        <p>Loading food details...</p>
      </div>
    );
  }

  // Show error if no food loaded
  if (!loadedFood) {
    return (
      <div className={styles.errorContainer}>
        <h2>Food item not found</h2>
        <Button onClick={() => router.push("/menu")}>
          <FaArrowLeft /> Back to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.editFoodContainer}>
      <div className={styles.header}>
        <Button
          onClick={() => router.back()}
          className={styles.backBtn}
          type="button"
        >
          <FaArrowLeft /> Back
        </Button>

        <h1 className={styles.title}>
          <FaEdit /> Edit Food Item
        </h1>

        <Button
          onClick={handlePreview}
          className={styles.previewBtn}
          type="button"
        >
          <FaEye /> Preview
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
              {/* Name Field */}
              <Input
                id="name"
                element="input"
                type="text"
                label="Food Name"
                validators={[VALIDATORS.REQUIRE(), VALIDATORS.MINLENGTH(2)]}
                errorText="Please enter a valid food name (at least 2 characters)"
                onInput={inputHandler}
                initialValue={loadedFood.name}
                initialValid={true}
                required
              />

              {/* Category Field */}
              <Input
                id="category"
                element="select"
                label="Category"
                validators={[VALIDATORS.REQUIRE()]}
                errorText="Please select a category"
                onInput={inputHandler}
                initialValue={loadedFood.category}
                initialValid={true}
                required
              >
                <option value="">Select Category</option>
                {FOOD_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Input>

              {/* Price Field */}
              <Input
                id="price"
                element="input"
                type="number"
                label="Price ($)"
                validators={[VALIDATORS.REQUIRE(), VALIDATORS.MIN(0.01)]}
                errorText="Please enter a valid price (minimum $0.01)"
                onInput={inputHandler}
                initialValue={loadedFood.price?.toString()}
                initialValid={true}
                step="0.01"
                min="0.01"
                required
              />

              {/* Quantity Field */}
              <Input
                id="quantity"
                element="input"
                type="number"
                label="Quantity"
                validators={[VALIDATORS.REQUIRE(), VALIDATORS.MIN(0)]}
                errorText="Please enter a valid quantity (minimum 0)"
                onInput={inputHandler}
                initialValue={loadedFood.quantity?.toString()}
                initialValid={true}
                min="0"
                required
              />
            </div>

            {/* Description Field */}
            <Input
              id="description"
              element="textarea"
              label="Description"
              validators={[VALIDATORS.REQUIRE(), VALIDATORS.MINLENGTH(10)]}
              errorText="Please enter a description (at least 10 characters)"
              onInput={inputHandler}
              initialValue={loadedFood.description}
              initialValid={true}
              rows="4"
              required
            />

            {/* Image Upload */}
            <div className={styles.imageSection}>
              <label className={styles.imageLabel}>
                <FaImage /> Food Image
              </label>

              <div className={styles.imageUpload}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  id="image-upload"
                />

                <label htmlFor="image-upload" className={styles.uploadBtn}>
                  <FaImage /> Choose New Image
                </label>

                <p className={styles.imageHint}>
                  Upload a new image to replace the current one (optional)
                </p>
              </div>

              {previewImage && (
                <div className={styles.imagePreview}>
                  <img
                    src={previewImage}
                    alt="Food preview"
                    className={styles.previewImg}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeImageBtn}
                  >
                    <FaTimes /> Remove
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <Button
                type="button"
                onClick={handleCancel}
                className={styles.cancelBtn}
                disabled={isSubmitting}
              >
                <FaTimes /> Cancel
              </Button>

              <Button
                type="submit"
                disabled={!formState.isValid || isSubmitting}
                className={styles.submitBtn}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className={styles.spinIcon} /> Updating...
                  </>
                ) : (
                  <>
                    <FaSave /> Update Food Item
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Panel */}
        <div className={styles.infoPanel}>
          <h3 className={styles.infoPanelTitle}>Current Food Info</h3>
          <div className={styles.infoItem}>
            <strong>ID:</strong> {loadedFood._id}
          </div>
          <div className={styles.infoItem}>
            <strong>Created:</strong>{" "}
            {new Date(loadedFood.createdAt).toLocaleDateString()}
          </div>
          <div className={styles.infoItem}>
            <strong>Last Updated:</strong>{" "}
            {loadedFood.updatedAt
              ? new Date(loadedFood.updatedAt).toLocaleDateString()
              : "N/A"}
          </div>
          <div className={styles.infoItem}>
            <strong>Current Price:</strong> ${loadedFood.price?.toFixed(2)}
          </div>
          <div className={styles.infoItem}>
            <strong>Current Quantity:</strong> {loadedFood.quantity}
          </div>
        </div>
      </div>
    </div>
  );
}
