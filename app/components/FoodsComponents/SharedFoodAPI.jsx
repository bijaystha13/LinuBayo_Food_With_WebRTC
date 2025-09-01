"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "@/app/shared/hooks/http-hook";
import { toast } from "react-toastify";
import FoodList from "./FoodsList";

export default function SharedFoodAPI({ category, placeholder }) {
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedFoods, setLoadedFoods] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_BASE = "http://localhost:5001";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const responseData = await sendRequest(`${API_BASE}/api/foods/`);

        if (Array.isArray(responseData)) {
          setLoadedFoods(responseData);
        } else {
          setLoadedFoods([]);
        }
      } catch (err) {
        console.error("Failed to fetch foods:", err);
      }
    };
    fetchFoods();
  }, [sendRequest]);

  async function foodDeletedHandler(deletedFoodId) {
    setIsDeleting(true);
    try {
      await sendRequest(`${API_BASE}/api/foods/${deletedFoodId}`, "DELETE");
      setLoadedFoods((prevFoods) =>
        prevFoods.filter((food) => food._id !== deletedFoodId)
      );
      toast.success("Food item deleted successfully!");
    } catch {
      toast.error("Failed to delete food item");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {(isLoading || isDeleting) && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !isDeleting && loadedFoods.length > 0 && (
        <FoodList items={loadedFoods} onDeleteProduct={foodDeletedHandler} />
      )}
      {!isLoading && !isDeleting && loadedFoods.length === 0 && (
        <div className="center">
          <h2>{placeholder || "No food items found."}</h2>
        </div>
      )}
    </>
  );
}
