import FoodDetails from "@/app/components/FoodsComponents/FoodDetails";

export default function FoodDetailsPage() {
  return <FoodDetails />;
}

// Optional: Add metadata
export async function generateMetadata({ params }) {
  const { foodId } = params;

  try {
    const response = await fetch(`http://localhost:5001/api/foods/${foodId}`);
    const data = await response.json();

    return {
      title: `${data.food?.name || "Food Details"} - Your Restaurant`,
      description: data.food?.description || "Delicious food item",
    };
  } catch {
    return {
      title: "Food Details - Your Restaurant",
      description: "View food item details",
    };
  }
}
